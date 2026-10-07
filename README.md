KLGA True Fullscreen Results Fix

Replace:
- app.js
- styles.css

This fixes the broken fullscreen grade/student results view by moving the selected
grade result card directly under <body> while fullscreen is active. That avoids
Chrome/Chromebook containing-block issues caused by dashboard backdrop/filter
containers.

Behavior:
- Fullscreen result card is truly fixed to the browser viewport.
- Top controls stay inside the visible screen.
- Results table scrolls inside the card.
- Restore returns the exact grade card to its original dashboard location.
- Escape, changing tabs, signing out, and dashboard rerenders safely restore it.
- No Firestore changes.
- No result data is changed.
