# KLGA — Google Teacher Sign-In + Anonymous Student Authentication

## What changed
- Teacher Dashboard now requires Google Sign-In.
- Teachers must also be explicitly authorized in Firestore collection `teachers`.
- Students still join with Session Name + Password and do NOT need a Google account.
- Student browsers use Firebase Anonymous Authentication automatically.
- Firestore rules are now substantially more restrictive than the old development rules.
- Existing sessions are automatically backfilled with student name/grade summaries after an authorized teacher opens the dashboard.

## Firebase Console setup

### 1. Enable Google Authentication
Firebase Console -> Authentication -> Sign-in method -> Google -> Enable.

### 2. Enable Anonymous Authentication
Firebase Console -> Authentication -> Sign-in method -> Anonymous -> Enable.

### 3. Authorized domain
In Authentication -> Settings -> Authorized domains, add the domain where KLGA is hosted.
For GitHub Pages this is usually:
YOUR-GITHUB-USERNAME.github.io

### 4. Publish the new Firestore rules
Firestore Database -> Rules -> replace the rules with `firestore.rules` from this ZIP -> Publish.

### 5. Authorize the first teacher
1. Open KLGA and click Teacher Dashboard.
2. Click Sign in with Google.
3. KLGA will display your Firebase UID because you are not authorized yet.
4. In Firebase Console -> Firestore Database -> Data:
   - Create collection: `teachers`
   - Create document
   - Document ID: paste the UID KLGA displayed
   - Add a field such as `email` (string) with your teacher email, or `name` (string).
5. Return to KLGA and open Teacher Dashboard again.

Only Google accounts with a matching `teachers/{UID}` document can use teacher functions.

## Important
The student session join flow still uses a session name/password stored in Firestore. This build is much safer than the open development rules, but a production-grade high-stakes assessment system would normally validate session credentials through trusted server-side code (for example a Cloud Function), rather than relying only on Firestore queries.
