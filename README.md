KLGA Fullscreen Monitor Viewport Width Fix

Replace:
- styles.css

Fixes:
- fullscreen monitor extending beyond the right edge
- clipped Close Monitor button
- clipped Finished summary card
- horizontal page overflow caused by width:100vw plus padding

The monitor now stays inside the visible viewport and keeps its side padding within the available width.
