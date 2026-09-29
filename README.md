# KLGA 5-Level — Connected to Firebase project kgla-32aef

This build is preconfigured with the Firebase Web App values shown in the Firebase Console.

## What now uses Firestore
- Student roster
- Testing sessions
- Student join status
- Assessment results

## Before using the site

1. In Firebase Console, create/enable Firestore Database.
2. Open Firestore Database -> Rules.
3. Paste the contents of `firestore.rules`.
4. Publish the rules.
5. Upload these site files to the GitHub Pages repository.

## Test

1. Open KLGA on GitHub Pages.
2. Open Teacher Dashboard.
3. Add a TEST student (do not use real student data yet).
4. Go to Firebase Console -> Firestore Database -> Data.
5. A `students` collection should appear.
6. Create a testing session in KLGA.
7. A `sessions` collection should appear.

The included rules are development-only and are intentionally open.
Before using real student information, add Firebase Authentication and secure the rules.
