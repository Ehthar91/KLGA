KLGA Individual Result Delete

Replace:
- app.js
- index.html
- styles.css

What this adds:
- Full Teacher accounts get a Delete Result button inside View Details.
- Viewer accounts do not see the delete button.
- A confirmation dialog shows the student, grade, testing window, result, and date.
- Only the selected result document is deleted.
- Student roster, other results, sessions, and saved data are not affected.

No Firestore rule update is required if you already installed the Viewer-role rules, because those rules already allow result deletion only for full Teachers.
