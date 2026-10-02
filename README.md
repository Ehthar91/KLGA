# KLGA — Firestore Results Dashboard

This build moves the Teacher Dashboard result workflow to Firestore.

## Fixed
- Teacher Dashboard loads results from the Firestore `results` collection.
- Results update live when a student finishes on another Chromebook.
- CSV export uses the Firestore results.
- Clear Results deletes the Firestore result documents.
- Newest results are shown first when timestamps are available.
- localStorage is only used as a fallback if Firebase is unavailable.

## Test
1. Upload this version to your site.
2. Open Teacher Dashboard on the teacher computer.
3. Complete a test as a fake student on another device/browser.
4. The result should appear automatically without refreshing the teacher page.
5. Verify the same result in Firebase -> Firestore Database -> Data -> results.

Continue using fake student data until Firebase Authentication and secure Firestore rules are added.
