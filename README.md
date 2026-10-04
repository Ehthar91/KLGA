# KLGA — UI Redesign + Dark Mode

This version adds a Light / Dark mode toggle to the redesigned KLGA interface.

Dark mode features:
- theme toggle in the main header
- follows the device theme the first time the site is opened
- remembers the selected theme on that device using localStorage
- dark styling for home, testing, results, Teacher Dashboard, tables, forms, sessions, roster, live monitor, and result details

All existing Firebase, Google teacher sign-in, student sessions, roster, live monitoring, results, and assessment logic remain unchanged.

## Level Color System
- Level 1 — Red
- Level 2 — Yellow
- Level 3 — Orange
- Level 4 — Green
- Level 5 — Blue


## Teacher Dashboard Navigation
The Teacher Dashboard now has working tabs:
- Overview — summary cards, active/recent sessions, and recent results
- Sessions — session creation and live monitoring
- Students — grade-separated roster management
- Results — School Year → Season → Grade results

The Overview cards also act as shortcuts to the related section.


## Unified Workspace UI
Student and teacher experiences now use the same visual language as the KLGA home page.

Student screens updated:
- Join Session
- Test Setup
- Testing
- Results

Teacher screens updated:
- Sign In
- Dashboard workspace banner
- Overview / Sessions / Students / Results navigation

Light mode, dark mode, and Level 1–5 color mapping remain intact.

## Expandable Grade Results + Separate Export
Each Grade 6 / 7 / 8 result card can now:
- expand or collapse independently
- export only that grade's results for the selected School Year and Season
- keep the existing full-results CSV export

Grade sections start collapsed to keep the Results view compact.

## Full-Screen Grade Results
Each Grade 6 / 7 / 8 result section now has a Full Screen button.
- opens that grade to fill the browser window
- keeps the results table scrollable
- keeps Export CSV available
- Restore returns to the normal Results layout
- Escape closes the expanded view

## Google Sheet Script Export
Each School Year → Season → Grade result section now includes a **Google Sheet Script** button.

The button:
- generates an Apps Script containing only that grade result set
- shows the generated script in a copyable modal
- provides Copy Script and Download .gs controls
- creates a formatted Google Sheet when the script is pasted into script.google.com and run
- does not require additional Google Drive/Sheets permissions inside KLGA itself

## Cleaner Grade Result Cards
Grade result cards are reorganized into:
- Grade + result count on the first line
- Expand / Collapse control on the top line
- Full Screen / Export CSV / Google Sheet Script in a dedicated action row

This prevents awkward wrapping and keeps all three grade cards aligned.

## Grade Result Card Layout V2
- Full Screen and Export CSV share the first action row.
- Google Sheet Script spans the full second row.
- Buttons stay inside each grade card.
- Disabled controls are visually consistent for grades with 0 results.

## Full-Width Desktop Layout
- Removes the narrow desktop max-width.
- Lets KLGA use nearly the full browser width with comfortable responsive margins.
- Teacher dashboard, overview cards, rosters, sessions, and results stretch across large monitors.
- Keeps mobile/tablet spacing unchanged.

## Compact Grade Result Buttons
- Smaller Full Screen / Export CSV buttons
- Smaller full-width Google Sheet Script button
- More compact Expand control
- Reduced card vertical height while keeping touch targets usable

## Three Grade Action Buttons on One Row
- Full Screen, Export CSV, and Google Sheet Script now sit on the same row on desktop.
- Buttons are compact to fit cleanly within each grade card.
- On smaller screens, the buttons still stack responsively.


## KLGA Growth Score (KGS)
KGS is an internal KLGA longitudinal score, not a standardized RIT score.

- Below Level 1: 0–99 based on progress toward the Level 1 benchmark.
- Level 1: 100–199 using performance on Level 2.
- Level 2: 200–299 using performance on Level 3.
- Level 3: 300–399 using performance on Level 4.
- Level 4: 400–499 using performance on Level 5.
- Level 5: 500–599 using mastery above the 75% Level 5 benchmark.
- Growth = current KGS minus the prior adaptive benchmark in the same school year.
- Individual Level Tests do not receive KGS because they are not full adaptive placements.

KGS is included in student results, teacher result tables, result details, dashboard recent results, CSV exports, and generated Google Sheet scripts.


## 40-Question Adaptive Benchmark
- Every Adaptive Test contains exactly 40 questions.
- Starts at Level 2 and continues adapting up or down.
- Once a placement boundary is identified, remaining questions concentrate near that boundary.
- Questions are sampled without repeats when unused items remain in the relevant pool.
- Overall % = total correct / 40.
- Placement still uses the 75% level benchmark.
- KGS and skill diagnostics use the larger evidence set.
- Individual Level Tests keep their selectable question counts.

## Grade-Scoped Clear Results
- Each School Year > Season > Grade card now has its own Clear Results button.
- Clear Results only deletes the results shown in that exact grade card.
- A custom warning popup shows school year, season, grade, and result count before deletion.
- The existing top-level Clear Results button now also uses the stronger warning popup.
- Cancellation or Escape closes the popup without deleting anything.

## Session-Controlled Student Test Settings
- Students joining a testing session can no longer choose Adaptive vs Individual.
- The teacher's session Test Type is enforced in code, not only in the UI.
- Adaptive sessions show a read-only "Adaptive Test • 40 questions" assignment.
- Individual Level sessions now let the teacher set both Level and Question Count.
- Students see those Individual settings but cannot change them.

## Stop-on-End + Persistent Resume
- Ending a session immediately stops students who are currently testing.
- Their exact in-progress test state is saved in the existing `sessionStudents` Firebase document.
- Progress is saved after each displayed question.
- Restarting the same session later lets the student rejoin, receive teacher approval, and choose Resume Test.
- Saved state includes question order/batch, current question, responses, adaptive path, skill/level data, and used-question keys.
- Completed tests clear the saved in-progress state.
- No Firestore rules changes are required.

Important: resume across days works on the same browser/device while Firebase anonymous authentication remains stored. Clearing site data, using incognito, or switching devices may change the anonymous Firebase UID and make the old progress inaccessible.

## Per-Student Test Controls
The live session monitor now supports individual test control:

### End Test
- Available for students who are Approved or Testing.
- Stops only that student.
- Keeps the saved in-progress attempt.
- Student can rejoin the same active session later, be approved again, and resume.

### Terminate & Restart
- Available for Testing/Approved students and for Paused students.
- Stops only that student.
- Clears that student's saved in-progress test.
- Marks the student Terminated.
- The next teacher approval clears the old terminate command and the student starts from Question 1.

Both teacher actions use confirmation dialogs.

No Firestore rules change is required because the teacher already has write access to sessionStudents and students can only read/update their own sessionStudents record.

## Live Progress + Automatic Speed Review

### Teacher Live Monitor
Each assigned student now shows:
- Questions answered / total
- Percent complete
- Current level
- Recent average response time
- Current testing status

### Automatic Speed Review
KLGA uses a conservative heuristic rather than pausing after one quick response.

A session student is automatically paused for Speed Review only when:
- at least 8 questions have been answered,
- 6 or more of the most recent 8 responses were under 2.5 seconds, AND
- the average response time across those 8 responses was under 3.0 seconds.

This is only a review signal. It does not label the student as cheating.

When triggered:
- student status becomes Speed Review,
- the test stops immediately,
- progress is saved,
- teacher sees Resume and Restart from Question 1.

Resume:
- continues from the saved point,
- resets the recent pace window,
- starts monitoring a new pace pattern.

Restart from Question 1:
- clears the saved in-progress attempt,
- requires the student to start over after approval.

## Session Monitor Full Screen + New Tab

### Full Screen
- Live Session Monitor now has a Full Screen / Restore button.
- The live table keeps updating while full screen.
- Escape exits full screen.

### Open in New Tab
- Open in New Tab creates a URL with `?monitor=<sessionKey>`.
- The monitor session key stays in the browser address.
- Refreshing that tab reopens the same session monitor.
- If the teacher is still signed in, the monitor opens automatically.
- If teacher authentication is required, the monitor URL remains intact and opens after successful sign-in.
- Dedicated monitor URLs automatically open the monitor in full-screen mode.

## Dedicated Monitor Mode Fix
- URLs containing `?monitor=<sessionKey>` now boot directly into a dedicated monitor mode.
- The normal KLGA home page is bypassed.
- Refreshing the browser keeps the same monitor because the session key remains in the URL.
- Firebase teacher auth restoration is awaited before deciding whether sign-in is required.
- If sign-in is required, the monitor URL remains unchanged and opens directly after successful Google sign-in.
- The dedicated monitor automatically opens full screen and receives live Firebase updates.
- "Exit Monitor" is now an explicit action that removes the monitor URL and returns to the Teacher Sessions page.
