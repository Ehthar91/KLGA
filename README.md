# KLGA Adaptive K1–K8 MVP

This build converts the existing KLGA K1–K8 assessment into an adaptive test.

## Adaptive logic

Students begin at K4.

Each tested level gives 4 randomized questions.

- 75% or higher: the level is considered passed and the test moves up.
- Below 75%: the test moves down.
- The test stops when it brackets the student's placement level.
- If K8 is passed, placement is K8.
- If K1 is not passed, placement is shown as Pre-K1.

Examples:

K4 pass -> K5 pass -> K6 fail
Placement: K5

K4 fail -> K3 fail -> K2 pass
Then K3 is already known to be failed, so placement: K2

K4 pass -> K5 pass -> K6 pass -> K7 pass -> K8 pass
Placement: K8

## Important assessment note

This is a transparent heuristic adaptive model, not a psychometrically calibrated
computer-adaptive test such as an IRT/Rasch-based assessment.

It is appropriate for prototyping the KLGA workflow and collecting pilot data.
After enough real student data is collected, item difficulty and cut scores should be
recalibrated before making high-stakes interpretations.

## Existing skill order

K1 — Alphabet Recognition
K2 — Letter Sounds
K3 — Vowel Recognition
K4 — Alphabet + Vowel
K5 — Tone Recognition
K6 — Blend Sound Recognition
K7 — Alphabet + Blend
K8 — Alphabet + Blend + Vowel

## Results

The teacher dashboard now shows:
- Student
- Grade
- Testing window
- Number of questions answered
- Adaptive path
- Placement
- Overall accuracy
- Date

CSV export includes the tested level scores as well.
