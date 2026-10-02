# KLGA Live Session — Start/End Fix

Fixed a Firebase session bug:

- Start Session now loads the session from Firestore.
- End Session now loads/updates the session in Firestore.
- Delete Session now loads/deletes the session from Firestore.
- Starting a session automatically opens the Live Session Monitor.
- Helpful error messages are shown if Firestore cannot update the session.

The previous version still used localStorage inside the Start/End/Delete handlers,
which caused Firebase-created sessions to appear but not start.
