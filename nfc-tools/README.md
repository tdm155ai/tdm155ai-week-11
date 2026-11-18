# nfc-tools

Scripts for writing URLs onto NFC cards and stickers, so a phone opens the link when it taps the tag.

Hardware: ACR122U USB reader (any PC/SC reader should work) and NTAG213/215/216 tags. Mifare Classic cards won't work.

No libnfc, libusb, nfcpy or sudo needed: macOS's built-in smart card service drives the reader and the script talks to it through PC/SC (pyscard).

## Setup (macOS)

```bash
brew install uv
```

Check the reader is visible (steady green light is normal):

```bash
uv run --with pyscard python -c "from smartcard.System import readers; print(readers())"
```

Expect `['ACS ACR122U PICC Interface']`. The first run takes a few seconds while uv fetches pyscard.

## Usage

From this folder, put a tag on the reader (or tap one within 30 s):

```bash
./write_url.py 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
```

**Quote the URL** — zsh treats `?` as a wildcard and stops with `no matches found`.

Read a tag back by running it with no URL:

```bash
./write_url.py
```

A successful write:

```
Tap a tag…
UID 04:50:d0:01:f3:57:13  CC e1 10 3e 00
NTAG215, 496 bytes, not protected
Wrote: https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

## Password protection

Unprotected tags can be rewritten, or locked for good, by anyone with a free phone app (NFC Tools and others). A password stops that and can be undone. Reading stays open, so phones still open the link.

```bash
./write_url.py 'https://example.com/red/start' --protect                    # write, then protect with $NFC_TAG_PASSWORD
./write_url.py 'https://example.com/red/start' --protect --password abcd    # ...or another 4-character password
./write_url.py 'https://example.com/red/start' --protect --password random  # ...or a random one
./write_url.py --protect       # protect a tag without changing it
./write_url.py --unprotect     # take the password off
```

- **Passwords are saved in `card-passwords.json`** in this folder, one per tag UID, before the tag is changed. The script looks them up itself, so after `--protect` you write to the tag as usual: `./write_url.py 'https://…'`. **Keep the file backed up.** Without it a protected tag can't be rewritten. It's in `.gitignore` and never committed.
- **The default password is whatever `NFC_TAG_PASSWORD` is set to** (`export NFC_TAG_PASSWORD=abcd`), so a group can share one password across its tags. Anyone with this script and the password can rewrite them. Use `--password random` for a tag that should have its own. With neither set, `--protect` asks for `--password`. Never put the password in a file you commit.
- A password is 4 bytes: 4 characters (`LL11`) or 8 hex digits (`fde95acf`). Phone apps turn typed passwords into those 4 bytes in their own ways, so don't expect a password set here to work in an app, or the reverse.
- Wrong guesses are unlimited (the tag's `AUTHLIM` is 0). Tags can instead be set to lock writes for good after a few wrong tries; this script never does that.
- A password protects pages 4 and up (all of the URL). Pages 0–3 (UID, lock bits, capability container) aren't covered, and NXP's permanent lock is separate: it can never be undone, and this script doesn't set it.

How it's set (NTAG213/215/216): `PWD` and `PACK` are written to the config pages (`0x2B`/`0x85`/`0xE5` and the page after), `CFG1`'s `PROT` bit is cleared so only writes need the password, and `AUTH0` in `CFG0` (`0x29`/`0x83`/`0xE3`) is set to 4 last, after the password has been checked. Writes to a protected tag start with `PWD_AUTH` (`1B` + password) through the reader's `FF 00 00 00 … D4 42` passthrough; the tag answers with `PACK`, which proves it's the tag we set.

**Testing a lock:** a tag stays authenticated until it loses power, so take it off the reader between "write with the password" and "try without it", or the second write wrongly succeeds.

## Troubleshooting

| Message | What to do |
| --- | --- |
| `no matches found` | Put the URL in single quotes. |
| `[]` (no readers) | Replug the reader, wait for the green light. Try another USB port or hub. |
| `No tag within 30 s` | Center the tag on the reader's logo and run again. |
| CC not E1 | Tag is blank or not NTAG/Ultralight (e.g. a Mifare Classic hotel/transit card). Use an NTAG21x. |
| `permanently write-protected` | Tag is permanently locked. Use another. |
| `…isn't in card-passwords.json, and it isn't NFC_TAG_PASSWORD` | Someone else protected it with their own password. It can't be rewritten without it. (Tags protected with your shared password work even if the file is lost: the script tries `NFC_TAG_PASSWORD` and saves it.) |
| `Page N didn't take after 3 tries` | The ACR122U drops writes when a tag is off-center. Center it and run again; the script checks every page by reading it back. |
| `Needs N bytes, tag holds M` | URL too long. NTAG213 holds 144 bytes, 215 holds 496, 216 holds 872. |
| `nfc-list: Unable to open NFC device` | Ignore — libnfc isn't used; macOS's smart card service holds the reader. |

## Other platforms

- **Linux:** `sudo apt install pcscd libccid`, then keep the kernel NFC driver off the reader:
  `echo -e "blacklist pn533_usb\nblacklist pn533\nblacklist nfc" | sudo tee /etc/modprobe.d/blacklist-nfc.conf` and replug. If pyscard won't build: `sudo apt install swig libpcsclite-dev`.
- **Windows:** smart card service is built in; the shebang doesn't work, so run `uv run write_url.py "https://…"` in PowerShell.

## What gets written

One NDEF URI record starting at page 4. Pages 0–3 (UID, lock bytes, capability container) are left alone. For the YouTube example:

```
03 24              NDEF TLV, 36 bytes
D1 01 20 55        record header, type "U"
02                 "https://www."
79 6F 75 … 63 51   "youtube.com/watch?v=dQw4w9WgXcQ"
FE                 terminator
```

Reader commands are ACR122U pseudo-APDUs: `FF CA` gets the UID, `FF B0` reads 4 pages, `FF D6` writes 1 page.
