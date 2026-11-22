# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML, CSS and JS, no build step (owner's pick, 2026-11-22). Hosting target not decided; must work on
GitHub Pages, Netlify or Vercel as plain files. The legal pages (`privacy.html`, `terms.html`,
`delete-account.html`) stay at their current paths: Google Play links to them.

## Users

Visitors deciding whether Lumen is for them: ambitious builders aged 22–40 (founders, engineers with side
projects, people in a "figuring out what's next" season). Secondary: Google Play reviewers and users looking for
the privacy policy, terms or account deletion.

## Product Purpose

Lumen is an Android app (iOS later) you talk to in conversations, by text or voice. It reads every message,
remembers what matters as editable memories, links what you say to your goals, and helps you act: goals with
step plans, habits, tasks, alarms and follow-ups, all made from the chat when you ask. Lumen's notes on Insights
say what it noticed, give honest feedback and suggest one thing to try. Success for the site: a visitor
understands this in seconds and leaves an email for early access.

## Positioning

A journal remembers what you wrote; a to-do app holds what you typed. Lumen does both from one conversation:
it reads what you say, keeps it, and turns it into goals, habits and plans, and each note it writes points back
to your own words.

## Operating Context

- App surfaces to show on the site: a conversation (text + voice, a reading under a message, a goal plan card),
  Today (goal rings, habits due, the quiet goal, open tasks), Insights notes, Plan (goals, habits, alarms, to-dos).
- The app is not public yet. The site's main action is "Coming soon" + early-access email signup.
- Hosted on GitHub Pages (darshDM/lumen-site). Signups go to a Google Sheet the owner controls, through a
  Google Apps Script web app (`tools/SIGNUP-SHEET.md`); the URL lives in `index.html`'s `signup-endpoint` meta.
  Chosen 2026-11-22.

## Capabilities and Constraints

- Android first; iOS later. Free and Pro tiers are planned; no prices exist, so none are shown.
- Voice recordings are transcribed and not stored. Account deletion is self-serve.
- Contact email is in the existing legal pages.

## Brand Commitments

- Name **Lumen**; the light / illumination metaphor; the violet orb is Lumen's presence in the app.
- Owner's binding visual brief for the site (2026-11-22): Swiss / International Typographic Style, dotted
  halftone shading, modern motion, half-screen app shots.
- App palette: graphite `#121316`, violet `#A896FF` / `#5B45D6`; app type is Inter.

## Evidence on Hand

- App icon and brand assets: `lumen-frontend/assets/` (icon, brand/).
- No testimonials, user counts, press, ratings, benchmarks or prices exist. Do not fabricate any.
- App screens on the site are recreated in HTML from the real app's layout with sample content; label them as
  illustrative where a visitor could mistake sample data for real users.

## Product Principles

1. Say exactly what it does. Plain words, no hype, no invented proof.
2. Show the app working: the screens prove the claim.
3. One action: early access.
4. Privacy is visible: link the policy and the "audio is not stored" fact near the signup.
