# Karen Language Benchmark — MVP

This is a first working prototype of an adaptive Karen Language benchmark system inspired by MAP-style testing.

## Included

- Student testing screen
- Adaptive question difficulty (K1–K9)
- Automatic benchmark score
- K1–K9 placement
- Domain performance
- Teacher dashboard
- CSV export
- Fall / Winter / Spring testing windows
- Local browser result storage

## How the adaptive engine works in this MVP

- Students begin around K5.
- Two correct answers in a row moves difficulty up one K level.
- Two incorrect answers in a row moves difficulty down one K level.
- The test currently stops after 15 questions.
- A final K1–K9 level and benchmark score are calculated.

This is intentionally a simple adaptive algorithm for the prototype. A production assessment should use a larger calibrated item bank and a more defensible scoring model, such as Rasch/IRT calibration.

## Important

The included questions are SAMPLE ITEMS only. Replace them with your actual Karen Language benchmark questions before using the results for instructional decisions.

## Run locally

Open `index.html` in a web browser.

For best results, host the folder with GitHub Pages, Firebase Hosting, Netlify, or another static web host.

## Current limitation

Results are saved using `localStorage`, which means they remain only on that browser/device.

The next major upgrade should connect the app to Firebase so:
- students can take the test on Chromebooks,
- results go to one teacher dashboard,
- testing sessions can be controlled,
- question banks can be edited online,
- Fall/Winter/Spring growth can be tracked across devices.

## Files

- `index.html` — page structure
- `styles.css` — design
- `app.js` — adaptive test logic, question bank, scoring, dashboard
