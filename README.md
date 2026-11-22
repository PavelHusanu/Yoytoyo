# Lernraum

A polished, responsive German study companion. All progress is saved locally in the browser. No account, database, build step, API key, or dependency installation is required.

## Run

**Quickest:** open `dist/Lernraum.html` directly in a modern browser. This self-contained edition needs no installation. Browser file-address storage support varies; use the server option below for the most consistent persistence. Use Export backup before changing how you open the app.

**Local server:**

Install Node.js 18 or newer, open this folder in a terminal, and run:

```sh
npm start
```

Open **http://127.0.0.1:4173**. Keep the terminal running while using the app. You can also run `node server.mjs` directly. Use an HTTP server; double-clicking index.html is not supported because the app uses JavaScript modules.

The `dist` folder can be served by any static web host. If you edit the source files, run `node build-standalone.mjs` to refresh the self-contained edition.

## Included

- Dashboard, searchable subjects, 15 numbered textbook sections, 639 vocabulary cards and 120 authored exercises.
- Flashcards with reveal, difficult-card filtering, personal cards, German pronunciation when the browser has a German voice, confidence ratings and spaced review dates.
- Multiple choice, fill-in-the-blank, translation and sentence-building exercises; answer explanations and missed-question practice.
- XP, levels, daily goals, streaks, achievements, unit mastery and activity history.
- Weekly study planner with add, edit, complete and remove actions.
- Focus timer with pause, reset and 5/15/25/45-minute sessions. Keep the tab open; refreshing resets an unfinished timer.
- Light/dark appearance, keyboard shortcuts, browser persistence and JSON backup/restore.

## Content scope: all sections through 1.4d

Checked against the supplied **Cambridge IGCSE German, Second Edition** PDF. Includes every lettered section in 1.1a–d, 1.2a–d, 1.3a–c and 1.4a–d. The book has no 1.3d. Lessons occupy printed pages 12–41 (PDF pages 14–43). The expanded vocabulary covers every entry on printed pages 42–45 (PDF pages 44–47), as requested in the subsequent vocabulary update.

Every section has its exact textbook heading, page references, revision notes, three bilingual examples, 34–53 vocabulary cards, eight authored exercises covering all four exercise types, and speaking and writing prompts. Writing drafts save locally as you type and are included in backups. Free writing is not automatically graded.

The notes, examples and activities are original revision material aligned to the sections, not a reproduction of every textbook exercise. The full PDF and publisher listening audio are not bundled. Browser pronunciation uses text-to-speech when available.

Older progress, XP, planner entries and personal cards are retained. Previous sample-unit completions do not count as completion of the new textbook sections. The new Chapter explorer achievement requires all 15 actual section IDs.

The four vocabulary pages contain 450 printed entries. Combined synonyms, instrument/music phrases and gender variants are separated into 469 study terms. Matching existing cards are reused; the 308 original card IDs and their wording remain unchanged. The collection now has 639 cards (331 added), with 34–53 per section. The textbook’s obvious printing errors are normalized (for example, hart and die Pommes). Choose 10, 20 or Entire deck in the flashcard session selector.

## Saving and backups

The browser stores data under `lernraum.v1`. Different browsers and different website addresses have separate progress. In Settings, export a backup before moving to a new browser, clearing site data or switching from local preview to the hosted app. Restore validates the file and asks before replacing progress. Nothing is sent to a server.

The optional Google Fonts stylesheet is the only external asset request. System font fallbacks preserve usability without network access. Browser speech voices depend on the operating system and may require connectivity.

## Progress rules

- 250 XP per level. Lesson completion awards 20 XP once per lesson.
- Flashcard reviews award 5 or 10 XP, once per card per calendar day.
- Correct exercise answers award 15 XP, once per question per day.
- Study activity maintains a local-calendar-day streak. A missed day breaks it; a three-day achievement remains earned.
- Flashcard “Again” remains due today; “Still learning” is due tomorrow; “Got it” starts at two days then doubles to 60 days. Two reviews with the latest marked “Got it” establish current mastery.
- Unit progress: 20% lesson, 50% mastered cards, 30% best practice score.
- Planner checkboxes do not award XP. Completed focus sessions award up to 50 XP once daily.

## Checks

```sh
npm test
npm run check
```

The automated suite checks persistence, backup validation, scoring, calendar boundaries, streaks, mastery, scheduling, answer normalization and content structure. See `TESTING.md` for browser verification results and limitations.

## Files

`dist/app.js` renders the app; `dist/styles.css` handles responsive themes; `dist/core.js` contains study rules and data validation; `dist/content.js` holds the editable lessons and merges the full vocabulary tables from `dist/textbook-vocabulary.js`. `server.mjs` is a small local-only static server. `.openai/hosting.json` holds the private Site identity.
