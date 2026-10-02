# KLGA Live Session Confirmation

Student flow:
1. Enter Session Name + Password.
2. Select roster name.
3. Status becomes Waiting.
4. Teacher sees the student live in Session Monitor.
5. Teacher clicks Confirm.
6. Student is released to the assigned test.
7. Status changes to Testing when the test begins.
8. Status changes to Finished when the test is completed.

Teacher flow:
1. Start a testing session.
2. Click Monitor.
3. See Not Joined / Waiting / Approved / Testing / Finished live.
4. Confirm Waiting students.

Requires Firebase/Firestore.
Use fake student data until Authentication and secure Firestore rules are added.
