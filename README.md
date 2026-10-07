KLGA Read-Only Viewer Role

Replace these website files:
- app.js
- firebase-app.js
- index.html
- styles.css
- firestore.rules

IMPORTANT: Publish the updated Firestore rules after uploading the website files.
Firebase Console -> Firestore Database -> Rules -> paste firestore.rules -> Publish

How account roles work
----------------------
KLGA continues to use the existing Firestore collection:
  teachers

The document ID must be the Google user's Firebase UID.

FULL TEACHER
Existing teacher documents continue to work with no changes.
A teacher document with no role field is treated as a full teacher.
You may also optionally set:
  role: "teacher"

VIEWER
To make an account read-only, create its UID document in the teachers collection and add:
  role: "viewer"

Viewer permissions
------------------
Viewers can:
- Sign in with Google
- Open the Results dashboard
- View student assessment results
- Open View Details
- Use Full Screen results view
- Export CSV
- Generate/download the Google Sheet Apps Script
- Open the How KLGA Works guide

Viewers cannot:
- View or edit the student roster
- View or manage testing sessions
- Open the live session monitor
- Add/edit/delete students
- Create/start/end/delete sessions
- Clear or delete results
- Write to Firestore assessment data

Security
--------
The read-only restriction is enforced in Firestore rules, not only by hiding buttons in the website UI.

Existing results are not deleted or modified by this update.
