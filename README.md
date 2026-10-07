KLGA Secure Result Deletion + Recently Deleted

This build adds stronger protection around destructive result actions.

Security behavior
- Individual Delete Result: teacher must type the student's name.
- Clear Grade/Window Results: teacher must type CLEAR GRADE <grade> <season>.
- Clear ALL Results: teacher must type CLEAR ALL RESULTS and then re-authenticate with Google.
- All normal delete/clear actions move results to Recently Deleted instead of permanently erasing them.
- Recently Deleted is visible only to full Teacher accounts, not Viewer accounts.
- A result in Recently Deleted can be restored.
- Permanent deletion from Recently Deleted requires typing DELETE PERMANENTLY.
- Firestore rules allow a teacher to recreate a result only when restoring the same document ID from deletedResults.

IMPORTANT FIREBASE STEP
After uploading the web files, publish the included firestore.rules:
Firebase Console -> Firestore Database -> Rules -> replace rules -> Publish

Patch files to replace
- app.js
- firebase-app.js
- index.html
- styles.css
- firestore.rules

Existing results are not modified by installing this update. The new behavior applies when a delete/clear action is used.
