# KLGA — K1 Alphabet Recognition MVP

This version focuses on the first KLGA skill: **Alphabet Recognition**.

## Master Karen alphabet bank
က ခ ဂ ဃ င စ ဆ ရှ ည တ ထ ဒ န ပ ဖ ဘ မ ယ ရ လ ဝ သ ဟ အ ဧ

## Test design
Each test gives 10 randomized recognition questions selected from all 25 letters.

The student sees a target letter and chooses the identical letter from four choices.

No letter-name matching is included.

## Difficulty stages
- K1-A: clearly different distractors
- K1-B: more similar/confusable distractors
- K1-C: mixed independent recognition

## Provisional interpretation
- 90–100% = K1-C
- 75–89% = K1-B
- Below 75% = K1-A

These cut scores are provisional until you collect real student data.

## Teacher dashboard
Shows student, grade, testing window, score, accuracy, stage, and date.

CSV export also includes missed letters.

## Current limitation
Results are stored only in the current browser. Firebase should be the next major infrastructure upgrade.
