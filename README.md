KLGA Fullscreen Student Results Visibility Fix

Replace:
- app.js
- styles.css

What this fixes:
- Fullscreen grade/student results now use the browser's visible viewport height (100dvh).
- The fullscreen result controls stay inside the visible screen.
- The results panel resets its own scroll position to the top each time fullscreen opens.
- The results table scrolls independently inside the fullscreen panel.
- Helps prevent Chromebook/browser UI changes from leaving the top controls above the visible area.
- Smaller-height screens get tighter safe margins automatically.

No Firestore rule update is required.
No result, roster, or session data is changed.
