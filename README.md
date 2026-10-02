# KLGA — Repaired Grade-Separated Results

This build restores the full Teacher Dashboard and safely separates Results by Grade 6, 7, and 8.

Restored:
- Testing Sessions table
- Create Session
- Start / End / Delete Session
- Live Session Monitor
- Student Roster grouped by grade

Results:
- Grade 6 / Grade 7 / Grade 8 sections
- Live Firestore updates
- Newest result first within each grade
- CSV export and Clear Results remain connected to Firestore

No Firebase data migration is required. Existing Firestore roster, sessions, and results should reappear automatically.
