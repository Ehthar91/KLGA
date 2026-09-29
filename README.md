# KLGA 5-Level Adaptive + Student Roster

New Student Roster section added to the Teacher Dashboard.

## Student Roster fields
- Student ID
- Student Name
- Grade

## Roster features
- Add student
- Edit student
- Delete student
- Prevent duplicate Student IDs
- Save roster in browser localStorage
- Sort roster alphabetically by student name for display

## Why this comes first
The roster will become the source of student identities for the future testing-session workflow:

Teacher creates session -> selects roster students -> students enter Session Name + Password -> students select their name -> teacher confirms -> testing begins.

## Current limitation
The roster is still stored only in this browser. It is not yet shared across devices.
Firebase or another backend will be needed before students on Chromebooks can join teacher-created sessions in real time.
