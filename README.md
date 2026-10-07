KLGA Page Scroll-Lock Fix

Replace:
- app.js

What this fixes:
- Prevents the main page from staying stuck with scrolling disabled after a fullscreen result or live monitor closes or re-renders.
- Cleans up stale fullscreen classes when changing Teacher Dashboard tabs, returning home, signing out, closing the monitor, or pressing Escape.
- Adds a safety check on clicks, resize, page restore, and visibility changes.
- If no fullscreen panel is actually open, KLGA automatically restores normal page scrolling.

No Firestore rules change is required.
No student roster, sessions, or assessment results are modified.
