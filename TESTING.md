# Verification

Course update verified on 22 November 2026. Original app checks were completed on 21 November 2026.

## Automated checks

All **24 Node.js tests pass**. They cover the exact 15-section sequence through 1.4d, contiguous lesson source page references within PDF pages 1–44, all four exercise types in every section, unique card and question IDs, local calendar dates, streaks, XP deduplication, levels, review scheduling, mastery, scoring, answer normalization, backup validation, storage failures and shuffling. Regression checks verify that old backups retain XP and history without falsely completing textbook sections, writing drafts round-trip safely, and the course achievement requires all 15 real section IDs. Vocabulary checks cover all 450 entries on printed pages 42–45, all 469 separated terms, correct translations for split phrases, and unchanged IDs and wording for every one of the original 308 cards.

JavaScript syntax checks pass for the application, study rules and content modules. Local HTTP server responds with status 200.

## Interactive browser checks

The full-vocabulary update was checked in both the self-contained edition and the module-based app:

- The library reports 639 cards, with 34–53 cards in each of the 15 sections.
- Selecting 1.1a and Entire deck starts a session with all 35 cards; a newly added Spanien card reveals Spain correctly.
- Selecting 1.4d and 20 cards starts a session of exactly 20 cards.
- Search finds the new phrase den Wettbewerb gewinnen and opens its card with the correct meaning, to win the competition.
- At 390 × 844, the long phrase and the expanded setup controls have no horizontal overflow. The temporary viewport was reset.
- No progress was awarded during these read/reveal checks. Browser error/warning logs were empty.
- Printed vocabulary pages 42–45 were visually checked in full; these correspond to physical PDF pages 44–47. This expands the earlier lesson-only source scope at the user's request.

The following checks were repeated for the textbook update:

- All 15 cards appear under four numbered topic groups; there is no fabricated 1.3d.
- Searching for 1.2c finds exactly Meine Schulgebäude. Its lesson shows book pages 24–25 / PDF pages 26–27, grammar notes, examples, 22 vocabulary entries, speaking and writing prompts.
- A writing draft survives a page reload and reopening the lesson.
- The lesson's practice button selects 1.2c in the grouped selector, which exposes all 15 sections.
- A two-question 1.2c fill-in session grades den and einen correctly, displays explanations and ends at 100% with 30 XP.
- Section 1.4d opens with book pages 40–41 / PDF pages 42–43. Its flashcard button selects the matching deck and starts a ten-card session.
- At 390 × 844, the subject library and the long 1.2d lesson title fit without horizontal overflow. The viewport override was reset afterwards.
- Local test data was cleared through the app. The finished course starts without fabricated progress.
- The rebuilt self-contained edition renders all 15 sections. Browser error/warning logs were empty.

Earlier full-app checks, before the content replacement:

- Desktop dashboard renders with its sidebar, goals, learning path and planner.
- Lesson opens with grammar, examples and vocabulary. Completion awards 20 XP.
- A full ten-card review completes, reveals meanings, accepts confidence ratings, updates due-card counts and records 95 XP for one “Again” plus nine “Got it” ratings.
- Fill-in-the-blank gives corrective feedback for an incorrect answer; missed-question retry accepts the corrected answer.
- Sentence builder grades ordered word selections; translation grades a typed German answer.
- An eight-question multiple-choice session finishes with 100% accuracy, 120 XP and level progression.
- Progress page shows quiz accuracy, activity history, unit progress, daily XP and unlocked achievements.
- Planner session can be added, edited from 15 to 20 minutes, and marked complete without granting study XP.
- A real five-minute focus timer finishes, awards 10 XP and records focused time. No test clock acceleration was used.
- Planner and earned progress remain after page reload.
- Preferences save; light and dark appearances render.
- Mobile viewport tested at 390 × 844. Navigation opens and closes; dashboard and settings have no horizontal overflow.
- JSON backup exports, is accepted by the restore picker, and shows a replacement confirmation with the correct 290 XP and one planner session. Confirming restore succeeds.
- Reset clears the test data. The delivered app starts without fabricated learning progress.
- Browser error/warning log was empty at the quiz check.

## Limits

The textbook section headings, grammar topics and page references were checked visually against the supplied scanned PDF. The app supplies original aligned revision material; it does not reproduce every publisher exercise or include listening recordings. Free writing is saved but not automatically graded. Speech playback depends on an installed German browser voice and was not verified with audio output. Browser checks used the desktop app’s browser; other browser engines were not tested. The self-contained edition was tested over local HTTP; direct-file browser storage support varies. An unfinished timer intentionally resets on refresh. Progress does not sync across devices or origins; use backup/restore to move it.
