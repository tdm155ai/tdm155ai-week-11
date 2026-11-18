#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.9"
# dependencies = ["pyscard"]
# ///
"""Write (or read back) a URL as an NDEF record on an NTAG21x / Ultralight tag,
and password-protect tags so no one else can rewrite them.

Talks to the reader through PC/SC (pyscard), so it works alongside macOS's
built-in smart card service instead of fighting it for the USB device.

    ./write_url.py https://example.com             # write
    ./write_url.py https://example.com --protect   # write, then lock writes with $NFC_TAG_PASSWORD
    ./write_url.py https://example.com --protect --password abcd   # ...or another 4-character password
    ./write_url.py https://example.com --protect --password random # ...or a random one
    ./write_url.py                                 # read what's on the tag, and whether it's protected
    ./write_url.py --protect                       # protect without changing the URL
    ./write_url.py --unprotect                     # remove the password (it stays on file)

Passwords live in card-passwords.json beside this script, by tag UID. They're
saved there before the tag is touched, and that file is never committed: lose it
and a protected tag can't be rewritten. Reading is never locked, so phones can
always open the tag.
"""
import argparse
import json
import os
import sys

from smartcard.CardRequest import CardRequest
from smartcard.CardType import AnyCardType
from smartcard.Exceptions import CardRequestTimeoutException

PREFIXES = {  # NDEF URI prefix compression (subset)
    0x01: "http://www.", 0x02: "https://www.", 0x03: "http://", 0x04: "https://",
}
# CC byte 2 (NDEF size / 8) -> (model, first config page CFG0). CFG1, PWD, PACK follow it.
MODELS = {0x12: ("NTAG213", 0x29), 0x3E: ("NTAG215", 0x83), 0x6D: ("NTAG216", 0xE3)}
DEFAULT_PASSWORD = os.environ.get("NFC_TAG_PASSWORD")  # your group's shared password, if you set one; never commit it
KEYS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "card-passwords.json")


def apdu(conn, cmd):
    data, sw1, sw2 = conn.transmit(cmd)
    if (sw1, sw2) != (0x90, 0x00):
        raise RuntimeError(f"APDU {bytes(cmd).hex(' ')} failed: {sw1:02X} {sw2:02X}")
    return bytes(data)


def read_page(conn, page):  # returns 16 bytes = 4 pages
    return apdu(conn, [0xFF, 0xB0, 0x00, page, 0x10])


def write_page(conn, page, four):
    """Write one page and check it by reading it back.

    The ACR122U's status for a write is unreliable (it reports some good writes
    as failed, and the reverse), so the read-back is what counts.
    """
    four = bytes(four)
    for _ in range(3):
        try:
            conn.transmit([0xFF, 0xD6, 0x00, page, 0x04, *four])
            if read_page(conn, page)[:4] == four:
                return
        except Exception:
            pass
    raise SystemExit(f"Page {page} didn't take after 3 tries. Center the tag on the reader and run again.")


def write_page_blind(conn, page, four):  # PWD and PACK read back as zeros, so they're checked by auth
    conn.transmit([0xFF, 0xD6, 0x00, page, 0x04, *four])


def authenticate(conn, key):
    """PWD_AUTH through the reader's PN532. True if the tag answers with the expected PACK."""
    pwd = bytes.fromhex(key["pwd"])
    data, sw1, sw2 = conn.transmit([0xFF, 0x00, 0x00, 0x00, 0x07, 0xD4, 0x42, 0x1B, *pwd])
    data = bytes(data)
    ok = (sw1, sw2) == (0x90, 0x00) and data[:3] == b"\xD5\x43\x00" and len(data) >= 5
    if ok and key.get("pack") is None:  # PACK unknown (password tried without a file entry): learn it
        key["pack"] = data[3:5].hex()
        return True
    return ok and data[3:5].hex() == key["pack"]


def load_keys():
    try:
        with open(KEYS) as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_keys(keys):
    with open(KEYS, "w") as f:
        json.dump(keys, f, indent=2)
    os.chmod(KEYS, 0o600)


def parse_password(text):
    """4 characters (e.g. LL11) or 8 hex digits (e.g. fde95acf) -> 4 bytes."""
    if len(text) == 8:
        try:
            return bytes.fromhex(text)
        except ValueError:
            pass
    raw = text.encode()
    if len(raw) != 4:
        sys.exit("--password must be exactly 4 characters (like LL11) or 8 hex digits")
    return raw


def build_ndef(url):
    for code, prefix in sorted(PREFIXES.items(), key=lambda kv: -len(kv[1])):
        if url.startswith(prefix):
            rest = url[len(prefix):]
            break
    else:
        code, rest = 0x00, url
    payload = bytes([code]) + rest.encode()
    record = bytes([0xD1, 0x01, len(payload), 0x55]) + payload  # short well-known "U"
    if len(record) >= 0xFF:
        sys.exit("URL too long for a short TLV")
    tlv = bytes([0x03, len(record)]) + record + b"\xFE"
    return tlv + b"\x00" * (-len(tlv) % 4)  # pad to whole pages


def parse_ndef(mem):
    if mem[0] != 0x03:
        return None
    record = mem[2:2 + mem[1]]
    if not record:
        return None
    if record[:2] != b"\xD1\x01" or record[3] not in (0x55, 0x54):
        return f"(other record: {record.hex(' ')})"
    payload = record[4:4 + record[2]]
    if record[3] == 0x54:  # text record
        lang = payload[0] & 0x3F
        return f"(text, not a URL) {payload[1 + lang:].decode(errors='replace')!r}"
    return PREFIXES.get(payload[0], "") + payload[1:].decode(errors="replace")


def main():
    ap = argparse.ArgumentParser(description="Write or read a URL on an NTAG21x tag; password-protect it.")
    ap.add_argument("url", nargs="?", help="URL to write; leave out to read the tag")
    ap.add_argument("--protect", action="store_true", help="lock writes with a password (reads stay open)")
    ap.add_argument("--password", help=f"with --protect: 4 characters, 8 hex digits, or 'random' (default: $NFC_TAG_PASSWORD)")
    ap.add_argument("--unprotect", action="store_true", help="remove the password from the tag")
    args = ap.parse_args()
    if args.password and not args.protect:
        sys.exit("--password only goes with --protect")
    if args.protect and args.unprotect:
        sys.exit("Pick --protect or --unprotect, not both")

    print("Tap a tag…")
    try:
        service = CardRequest(timeout=30, cardType=AnyCardType()).waitforcard()
    except CardRequestTimeoutException:
        sys.exit("No tag within 30 s")
    conn = service.connection  # keep `service` alive: dropping it releases the PC/SC context
    conn.connect()

    uid = apdu(conn, [0xFF, 0xCA, 0x00, 0x00, 0x00])
    cc = read_page(conn, 3)[:4]
    print(f"UID {uid.hex(':')}  CC {cc.hex(' ')}")
    if cc[0] != 0xE1:
        sys.exit("Tag isn't NDEF-formatted (capability container not E1). Not an NTAG/Ultralight?")
    capacity = cc[2] * 8
    model, cfg0_page = MODELS.get(cc[2], (None, None))

    uid_key = uid.hex(":")
    keys = load_keys()
    cfg = read_page(conn, cfg0_page) if cfg0_page else None
    protected = cfg is not None and cfg[3] <= 4 + capacity // 4
    print(f"{model or 'unknown model'}, {capacity} bytes, "
          + ("password-protected" + (" (password on file)" if uid_key in keys else " (NO password on file)")
             if protected else "not protected"))

    if args.url is None and not (args.protect or args.unprotect):
        mem = b"".join(read_page(conn, p) for p in range(4, 4 + capacity // 4, 4))
        print("URL:", parse_ndef(mem) or "(empty)")
        return

    if (args.protect or args.unprotect) and not model:
        sys.exit("Passwords need an NTAG213/215/216; this tag's model isn't known")
    if cc[3] != 0x00:
        sys.exit("Tag is permanently write-protected")

    if protected:
        if uid_key in keys:
            if not authenticate(conn, keys[uid_key]):
                sys.exit("Password on file was rejected by the tag")
        else:  # not on file: try the shared default, and save it if it works
            if not DEFAULT_PASSWORD:
                sys.exit("Tag is password-protected and its password isn't in card-passwords.json (set NFC_TAG_PASSWORD if it uses your shared one)")
            key = {"pwd": parse_password(DEFAULT_PASSWORD).hex(), "pack": None}
            if not authenticate(conn, key):
                sys.exit("Tag is password-protected, its password isn't in card-passwords.json, and it isn't NFC_TAG_PASSWORD")
            keys[uid_key] = key
            save_keys(keys)
            print("Not on file, but NFC_TAG_PASSWORD worked; saved it")
        print("Password accepted")

    if args.url:
        data = build_ndef(args.url)
        if len(data) > capacity:
            sys.exit(f"Needs {len(data)} bytes, tag holds {capacity}")
        for i in range(0, len(data), 4):
            write_page(conn, 4 + i // 4, data[i:i + 4])
        readback = b"".join(read_page(conn, p) for p in range(4, 4 + len(data) // 4 + 4, 4))
        print("Wrote:", parse_ndef(readback))

    if args.unprotect:
        if not protected:
            print("Already unprotected")
            return
        cfg0 = bytearray(cfg[:4])
        cfg0[3] = 0xFF  # AUTH0 past the end: no page needs the password
        write_page(conn, cfg0_page, cfg0)
        print("Unprotected (password kept on file in case the tag is protected with it again)")

    if args.protect:
        if protected:
            if args.password:
                print("Already protected; --password ignored (unprotect first to change it)")
            else:
                print("Already protected")
            return
        chosen = args.password or DEFAULT_PASSWORD
        if not chosen:
            sys.exit("--protect needs --password (4 characters, 8 hex digits, or 'random'), or NFC_TAG_PASSWORD set")
        pwd = os.urandom(4) if chosen == "random" else parse_password(chosen)
        key = {"pwd": pwd.hex(), "pack": os.urandom(2).hex()}
        keys[uid_key] = key
        save_keys(keys)  # on file before the tag changes
        cfg0, cfg1 = bytearray(cfg[:4]), bytearray(cfg[4:8])
        write_page_blind(conn, cfg0_page + 2, bytes.fromhex(key["pwd"]))
        write_page_blind(conn, cfg0_page + 3, bytes.fromhex(key["pack"]) + b"\x00\x00")
        cfg1[0] &= 0x78  # PROT=0: only writes need the password. AUTHLIM=0: no lockout after wrong tries.
        write_page(conn, cfg0_page + 1, cfg1)
        if not authenticate(conn, key):  # check it works before switching protection on
            sys.exit("Password didn't verify; tag left unprotected. Run again.")
        cfg0[3] = 0x04  # AUTH0: from page 4, all user memory. The last step.
        write_page(conn, cfg0_page, cfg0)
        shown = key["pwd"] if chosen == "random" else chosen
        print(f"Protected. Password {shown} saved in card-passwords.json")


if __name__ == "__main__":
    main()
