# Game mechanics

*50 mechanics in 8 families, one per page. TDM 155AI, week 11.*

A mechanic is a rule that makes something happen: a timer, a vote, a secret, a turn, a roll of the dice. Games are built from mechanics.

- **Goals and the loop:** Goal and win condition · Core loop · Score and points · Lives, failure, and retry · Debt and obligation
- **Time:** Timer and countdown · Turn order · Real-time pressure · Rhythm and timing window · Incremental growth · Escalation
- **Chance and information:** Chance · Push your luck · Hidden information · Hidden role and social deduction · Hidden rule · Fog of war and exploration · Asymmetric information
- **Players together:** Voting and the collective decision · Cooperation · Roles and role swap · Trading and negotiation · Alliance and betrayal · The spect-actor · Story circle · Mirroring and imitation
- **Resources and economy:** Resource management · Engine building · Tech tree and unlocks · Territory and area control · Worker placement · Deck building and the draw · Crafting and combining
- **Space and the body:** Movement and position · Zones and spatial triggers · Gesture input · Memory and sequence · Sensory constraint · Location play
- **Rules that bend:** Constraint (the forbidden move) · Interruption and event cards · Rewind and do-over · Irreversible choice · Puzzle and lock-and-key
- **Story, characters, and progress:** Branching dialogue · The improvising character (AI co-star) · Quests and missions · Levels and progression · Achievements and badges · Feedback ("juice")

# Goal and win condition

*The state that ends the game and says who won.*

## Shows it

Chess (checkmate)

## Try it in two minutes

Play tic-tac-toe, then change the goal: whoever makes three in a row loses.

## Build it

A `/stage` page that watches one number and fires an end cue when it is reached.

Goals and the loop · 01

# Core loop

*The short cycle of actions the player repeats all game.*

## Shows it

*Universal Paperclips* (make, sell, invest)

## Try it in two minutes

Name the three things you do over and over in a game you know. Swap one and say what changes.

## Build it

Ask Claude Code for a one-page loop with three buttons on `/launch`; play it for two minutes, then change one step.

Goals and the loop · 02

# Score and points

*A number that turns actions into progress you can compare.*

## Shows it

*Pac-Man*

## Try it in two minutes

Score a conversation: a point for every question asked. Watch how people start talking.

## Build it

A score counter on `/stage` that every cue adds to.

Goals and the loop · 03

# Lives, failure, and retry

*A way to lose that sends you back without ending play.*

## Shows it

*Super Mario Bros.*; *Hades* (each death is progress)

## Try it in two minutes

Three lives each in a round of rock-paper-scissors; the last one standing wins.

## Build it

Three lives on `/stage`; a MediaPipe zone you must not enter costs one.

Goals and the loop · 04

# Debt and obligation

*You owe something and cannot leave until it is paid.*

## Shows it

*Monopoly* (rent and mortgages)

## Try it in two minutes

You owe the room one laugh. You can't sit down until you get it.

## Build it

`/voice` listens for a word or a laugh; until it hears it, the exit cue stays locked.

Goals and the loop · 05

# Timer and countdown

*A clock that forces a decision before it runs out.*

## Shows it

*Boggle* (the sand timer)

## Try it in two minutes

Describe your project in thirty seconds while someone counts down aloud.

## Build it

A big countdown on `/stage`, started from a MIDI pad.

Time · 06

# Turn order

*Players act one at a time in a set sequence.*

## Shows it

Chess

## Try it in two minutes

Tell a story one word at a time around the table.

## Build it

A cue list on `/launch` where Go passes the turn and lights the next player's name.

Time · 07

# Real-time pressure

*Everyone acts at once and the world does not wait.*

## Shows it

*Overcooked!*

## Try it in two minutes

Everyone sorts a shuffled deck by suit at once, sharing one table.

## Build it

Orders arrive as timed cues on `/stage`; players clear them with keys.

Time · 08

# Rhythm and timing window

*Act on the beat; how close you are is the score.*

## Shows it

*Dance Dance Revolution*; *Guitar Hero*

## Try it in two minutes

Clap on the beat of a song; anyone off the beat sits out.

## Build it

MIDI pads scored against a click track, accuracy shown on `/stage`.

Time · 09

# Incremental growth

*Numbers grow by themselves, and the player tunes the rate.*

## Shows it

*Cookie Clicker*; *Universal Paperclips*

## Try it in two minutes

Every minute, each player's pile of paper clips doubles, unless they spend some to change the rule.

## Build it

Claude Code builds a one-page clicker on any theme: three resources, each one feeding the next.

Time · 10

# Escalation

*Each round asks a little more than the last.*

## Shows it

*Tetris* (the speed rises); *Jenga*

## Try it in two minutes

Each line of a scene must be one word shorter than the last.

## Build it

Each cue fires faster than the last until someone hits stop.

Time · 11

# Chance

*Dice, cards, or coins decide part of what happens.*

## Shows it

*Yahtzee*

## Try it in two minutes

Flip a coin: heads, your character tells the truth; tails, they lie until the end.

## Build it

A dice roller on `/stage` triggered by a pad; the roll picks the next cue.

Chance and information · 12

# Push your luck

*Keep going for more, or stop and keep what you have.*

## Shows it

*Can't Stop*; blackjack

## Try it in two minutes

Roll a die as often as you like and add it up; a 1 wipes your total. Stop whenever you want.

## Build it

Each press adds a point and a chance of losing everything; a second pad banks.

Chance and information · 13

# Hidden information

*Some players know what others do not.*

## Shows it

Poker; *Stratego*

## Try it in two minutes

Tell the room a secret your scene partner must never learn.

## Build it

Each player's phone shows a private card; the projector shows only the public state.

Chance and information · 14

# Hidden role and social deduction

*Secret roles; the group must work out who is who.*

## Shows it

*Werewolf* (Mafia); *Among Us*

## Try it in two minutes

Deal one secret card to each player; one card says "traitor". Talk for three minutes, then vote.

## Build it

A bot sends each player a role by direct message; the room votes on `/stage`.

Chance and information · 15

# Hidden rule

*One player invents a secret rule; the others discover it by playing.*

## Shows it

*Zendo*

## Try it in two minutes

One person thinks of a rule about objects on the table. Others place objects and hear only yes or no.

## Build it

Claude holds the rule; players show cards to `/draw-a-box`, and Claude says yes or no.

Chance and information · 16

# Fog of war and exploration

*The map is hidden until you go there.*

## Shows it

*Civilization*

## Try it in two minutes

Cover a map with sticky notes; lift one each turn.

## Build it

The projector darkens a paper map on the table and lifts the fog wherever a hand or token goes.

Chance and information · 17

# Asymmetric information

*Each group holds a part the others need.*

## Shows it

*Keep Talking and Nobody Explodes*

## Try it in two minutes

One person describes a drawing back to back with a partner who has to redraw it.

## Build it

One player sees the puzzle on `/stage`, the other holds the printed manual.

Chance and information · 18

# Voting and the collective decision

*The group chooses, and everyone lives with the result.*

## Shows it

*Quiplash* (the audience votes)

## Try it in two minutes

Show three possible endings, ten seconds each. The room picks one, and you play it.

## Build it

Phones vote; the tally fires the winning cue on `/stage`.

Players together · 19

# Cooperation

*Everyone wins or loses together.*

## Shows it

*Pandemic*

## Try it in two minutes

The group counts to twenty; anyone may say the next number, but two voices at once means starting over.

## Build it

A shared bar on `/stage` that rises only when every player hits their pad in the same window.

Players together · 20

# Roles and role swap

*Each player has a different power, and the roles can change hands.*

## Shows it

*Pandemic* (role cards)

## Try it in two minutes

Play a short scene; halfway through, the highest-status character becomes the lowest.

## Build it

Roles dealt as cards; a cue on `/launch` reshuffles them mid-game.

Players together · 21

# Trading and negotiation

*Players exchange what they have for what they need.*

## Shows it

*Catan*

## Try it in two minutes

Everyone gets three random objects; you need a set of three alike. Trade until someone has one.

## Build it

Tokens on the table read by `/draw-a-box`; the ledger updates on `/stage`.

Players together · 22

# Alliance and betrayal

*Deals that can be broken, with nothing to enforce them.*

## Shows it

*Diplomacy*

## Try it in two minutes

Make deals for two minutes, then everyone writes a move in secret and reveals at once.

## Build it

Orders written in secret and revealed all at once on `/stage`.

Players together · 23

# The spect-actor

*Watchers can step in and change the play.*

## Shows it

*Twitch Plays Pokémon*

## Try it in two minutes

Anyone watching can say "stop", step in, and replace a player.

## Build it

Audience phones or voices send cues that the player on stage must take.

Players together · 24

# Story circle

*Everyone adds to the story in turn.*

## Shows it

*Once Upon a Time* (storytelling cards)

## Try it in two minutes

Each person adds one sentence to a story; the last person must end it.

## Build it

`/voice` transcribes each turn; Claude keeps the story so far on `/stage`.

Players together · 25

# Mirroring and imitation

*Copy what the leader does.*

## Shows it

Simon Says

## Try it in two minutes

Face a partner and mirror every move; switch leaders without saying so.

## Build it

MediaPipe pose compares a player to the leader and scores the match.

Players together · 26

# Resource management

*Spend limited things to get what you want.*

## Shows it

*Civilization*; *Catan*

## Try it in two minutes

Each player gets ten paper clips. Every action costs some; the table sets the prices first.

## Build it

Four meters on `/stage` (for example compute, power, water, and trust) that each action raises or drains.

Resources and economy · 27

# Engine building

*Early purchases make later turns stronger.*

## Shows it

*Splendor*

## Try it in two minutes

Each card you buy makes the next one cheaper. Buy in an order that snowballs.

## Build it

Claude Code builds a card market where each card bought lowers the price of the next.

Resources and economy · 28

# Tech tree and unlocks

*Progress opens new options in a set order.*

## Shows it

*Civilization*

## Try it in two minutes

Draw a tree of five inventions on paper; you can only build one when the one below it is done.

## Build it

A JSON tree Claude drafts from a theme, shown as a map players unlock on `/stage`.

Resources and economy · 29

# Territory and area control

*Hold more of the board than the others.*

## Shows it

Go; *Risk*

## Try it in two minutes

Take turns placing sticky notes on a grid; you hold a square when you surround it.

## Build it

Colored paper on a grid read by `/draw-a-box`; the projector shades who holds what.

Resources and economy · 30

# Worker placement

*Each player sends a few workers to claim scarce actions.*

## Shows it

*Agricola*

## Try it in two minutes

Five action cards on the table, three coins each: place a coin to claim an action, one coin per card.

## Build it

Tokens on printed action spaces, read by the overhead camera.

Resources and economy · 31

# Deck building and the draw

*Players build the deck they will draw from.*

## Shows it

*Dominion*

## Try it in two minutes

Start with five blank cards; each round, write one new card into your deck and shuffle.

## Build it

A draw-a-card app with a "buy a card" step added.

Resources and economy · 32

# Crafting and combining

*Put two things together to make a third.*

## Shows it

*Minecraft*; *Infinite Craft* (a model decides)

## Try it in two minutes

Two people each hold up an object; the room names what they make together.

## Build it

Two cards under `/draw-a-box`; Claude names what they make and adds it to the board.

Resources and economy · 33

# Movement and position

*Where your body is changes what you can do.*

## Shows it

*Twister*

## Try it in two minutes

Take one step closer to the audience with every line you say.

## Build it

MediaPipe pose: a cue fires when a hand and a foot are on the called spots.

Space and the body · 34

# Zones and spatial triggers

*Stepping into a part of the room makes something happen.*

## Shows it

Red Light, Green Light

## Try it in two minutes

Tape three zones on the floor; each one makes a different sound when someone stands in it.

## Build it

`/track/zones`: a column lights when occupied; moving on red costs a life.

Space and the body · 35

# Gesture input

*The body is the controller.*

## Shows it

*Wii Sports*; *Just Dance*

## Try it in two minutes

Conduct the room: raise your hand and they get louder, lower it and they hush.

## Build it

`/track/instruments` maps hand height to a value the game reads.

Space and the body · 36

# Memory and sequence

*Repeat a growing sequence without a mistake.*

## Shows it

*Simon* (the 1978 toy)

## Try it in two minutes

Each person repeats the gestures so far and adds one.

## Build it

Four MIDI pads with lights and sounds; the sequence grows by one each round.

Space and the body · 37

# Sensory constraint

*Take away a sense and the game changes.*

## Shows it

Marco Polo

## Try it in two minutes

Lights out: finish the scene in the dark.

## Build it

A blackout cue on `/stage`; players find each other by sound alone.

Space and the body · 38

# Location play

*The real world is the board.*

## Shows it

*Pokémon Go*

## Try it in two minutes

Hide five numbered cards around the studio; the first to find them in order wins.

## Build it

Printed QR posters around the room; scanning one fires a cue.

Space and the body · 39

# Constraint (the forbidden move)

*A rule takes something away, and play has to work around it.*

## Shows it

*Taboo*

## Try it in two minutes

Describe your favorite food without using the letter E.

## Build it

`/voice` listens for the forbidden words and fires a buzzer.

Rules that bend · 40

# Interruption and event cards

*Something from outside breaks in and must be absorbed.*

## Shows it

*Monopoly* (Chance cards)

## Try it in two minutes

Mid-scene, a partner hands you a card; play it at once.

## Build it

A MIDI pad throws a random event card onto the projector.

Rules that bend · 41

# Rewind and do-over

*Go back and play the last moment again, changed.*

## Shows it

*Braid*; *Prince of Persia: The Sands of Time*

## Try it in two minutes

Rewind the last ten seconds of a scene and play them again, changing one thing.

## Build it

A recorded cue history on `/launch` that can be replayed from any point.

Rules that bend · 42

# Irreversible choice

*A decision that cannot be undone shapes the rest of the game.*

## Shows it

*The Oregon Trail*

## Try it in two minutes

Before the scene, each player tears up one of three cards. That option is gone for good.

## Build it

One choice locks a branch for good; `/stage` shows the road not taken.

Rules that bend · 43

# Puzzle and lock-and-key

*A problem with a solution that opens the next part.*

## Shows it

*Portal*; escape rooms

## Try it in two minutes

Lock a box with a three-digit code; hide the three digits in three riddles.

## Build it

A word said to `/voice` or a card shown to the camera unlocks the next cue.

Rules that bend · 44

# Branching dialogue

*The player picks what to say, and the conversation forks.*

## Shows it

*Mass Effect*; Choose Your Own Adventure books

## Try it in two minutes

Write a conversation on colored cards: one opener, three replies, and what each reply leads to.

## Build it

Colored dialogue cards under `/draw-a-box`; the projector plays the chosen branch.

Story, characters, and progress · 45

# The improvising character (AI co-star)

*A character who answers whatever you say, in role.*

## Shows it

*Façade*; *AI Dungeon*

## Try it in two minutes

One person plays a shopkeeper and must answer everything in character, however strange.

## Build it

A voiced character, built like week 9's Ensemble agents, that hears the player through `/voice`.

Story, characters, and progress · 46

# Quests and missions

*A task with a reward gives play a direction.*

## Shows it

*The Legend of Zelda*

## Try it in two minutes

Draw a quest card at the start of studio ("find someone who has used a MIDI pad"); finish it by the end.

## Build it

Claude deals a quest card per player; finishing it fires a cue.

Story, characters, and progress · 47

# Levels and progression

*Experience adds up to new abilities.*

## Shows it

*Pokémon*

## Try it in two minutes

Every three tasks you finish, you unlock a new tool you're allowed to use.

## Build it

A level bar per player on a wall display.

Story, characters, and progress · 48

# Achievements and badges

*Named rewards for specific feats, collected and shown.*

## Shows it

Xbox achievements

## Try it in two minutes

Write five badges for today's class ("First cue fired") and award them as people earn them.

## Build it

A badge fires on `/stage` when a cue pattern is hit; a printed badge sheet for the wall.

Story, characters, and progress · 49

# Feedback ("juice")

*Every action gets a sound, light, or shake that makes it feel good.*

## Shows it

*Peggle*

## Try it in two minutes

Play rock-paper-scissors where the room cheers every win. Then play it in silence.

## Build it

Every cue also fires a light and a sound on `/stage`; take it away and play again.

Story, characters, and progress · 50
