# KLGA 5-Level — Firebase Ready

This build adds a Firebase/Firestore integration layer.

## What is wired for Firebase
- Student roster
- Testing sessions
- Session lookup by Session Name + Password
- Student session status
- Assessment results

## Student flow
1. Student clicks Join Testing Session.
2. Enters Session Name + Password.
3. Selects their roster name.
4. Session/student status is written to Firestore.
5. Student proceeds to the assigned assessment.

## Setup

1. Create or open your Firebase project.
2. In Firebase Console:
   Project settings -> Your apps -> Add Web App
3. Copy your firebaseConfig values.
4. Open `firebase-app.js`.
5. Replace all PASTE_... placeholders.
6. Enable Firestore Database.
7. For MVP testing, paste `firestore.rules` into Firestore Rules and publish.

IMPORTANT:
The included Firestore rules are intentionally open for development/testing.
Do NOT use those rules for a production system containing real student data.
The next step should be Firebase Authentication + locked-down rules.

## Collections
- students
- sessions
- sessionStudents
- results

If Firebase config is not filled in, the site falls back to browser localStorage.
