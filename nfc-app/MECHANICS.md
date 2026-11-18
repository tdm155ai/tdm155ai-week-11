# The cards' base mechanics

Worked out November 17, 2026 from a hand-drawn sheet. These are the three axes for describing any card mechanic: the **scale** of the relationship, its **type and direction**, and **what is transmitted**.

## The sheet

- **one-to-many:** one user, arrows out to four cards.
- **one-to-one:** three user → card pairs, drawn dashed (by the sheet's own legend, dynamic).
- **[web: how many people on the trail]**, a third, bigger scale.
- Legend: **→ static, one-time**; **⋯> dynamic, updating**; *triggers? one way? ⟷*
- A card carries **links** (website, YouTube) and so on.

## 1. Scale

| scale | shape | example |
| --- | --- | --- |
| one-to-one | one person, one card | your own card, which knows it's yours |
| one-to-many | one person, many cards | collecting cards, following a trail of stations |
| many-to-one *(not on the sheet)* | many people, one card | a station everyone taps, a shared counter, a guestbook |
| many-to-many, the "web" | many people, many cards | how many people are on the trail |

Many-to-one is the step between one-to-many and the web: once one card can count who tapped it, "how many people are on the trail" is those counts added up across cards.

## 2. Type and direction

The card itself is always **static and one-way**: once written, it gives every phone the same bytes. Anything dynamic comes from the card holding a link to **our server**, which can change what it returns.

- **Card → phone (static, one-time):** the card holds a fixed destination (a YouTube link). Same for everyone, every time, and no one learns that the tap happened.
- **Card → our server → phone (dynamic, updating):** the card holds something like `/red/c7`. The card never changes, but the page can: by tap count, by time, by what has happened on the trail.
- **Phone → server (the tap as a trigger):** each tap tells the server "card c7, just now", and the server can react elsewhere: a screen on the wall, a score, other people's phones.
- **Who tapped:** with no sign-in, a cookie on each phone lets the server tell "the same phone as before" without knowing the person. That's enough for one-to-one and for counting people on the trail.
- **Phone → card (truly two-way):** rewriting the card from a web page works only in Chrome on Android (Web NFC). iPhones need a native app, so this isn't a dependable mechanic for a mixed room. Two-way through the server is.

The card is one way; the system can be two-way.

## 3. What can be transmitted

| on the card | what a phone does on tap, with no app installed |
| --- | --- |
| **URL** (web page, YouTube, maps) | opens on both iPhone and Android: **the dependable option** |
| phone number, SMS, email | opens the dialer or a draft message (on iPhone, as prefilled links) |
| plain text | mostly nothing; on iPhone, nothing |
| contact card, Wi-Fi login | Android handles these; iPhone mostly doesn't without an app |

Capacity: NTAG213 about 140 bytes of URL, 215 about 490, 216 about 870. A short URL fits easily; a paragraph of text doesn't fit on a 213.

So in practice a card carries **only a link, pointing at this app**. The link is the address, and the app supplies the rest: text, images, video, choices, pages that change. The card's real job is to say **"this card, here, now."**

## The catch

Every dynamic mechanic needs the card's URL to keep working. A quick tunnel's URL changes on every restart, and cards written with the old one stop working. For cards that go home with people, or a trail that runs more than one session, use a named tunnel on a stable domain (see `README.md`).
