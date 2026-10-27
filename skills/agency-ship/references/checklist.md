# SHIP — gate checklist (process gate only)

## Process gate (signed by PM)

- [ ] File lives at `docs/agency-flow/<slug>/04-ship.md`.
- [ ] Release notes are written in user-facing language, not dev jargon.
- [ ] Version / tag is present and follows the repo convention.
- [ ] Changelog covers every artifact produced in BUILD.
- [ ] All four references (FRAME, PROPOSE, BUILD, VERIFY) are present.
- [ ] VERIFY verdict is quoted exactly.
- [ ] Every VERIFY condition is carried as a follow-up with owner + due date.
- [ ] `## Gates` block shows `Domain gate: N/A`.
- [ ] No follow-up was invented that was not in VERIFY (SHIP is not
      the place for new work).

## Domain gate

Always `N/A`. If a domain gate is present in SHIP, it means VERIFY's
domain gate was bypassed. Refuse to sign the process gate.

## Rejection triggers

- VERIFY verdict quoted as `PASS` when the file says
  `PASS-WITH-CONDITIONS`.
- VERIFY conditions absent from `## Follow-ups carried from VERIFY`.
- Changelog missing a BUILD artifact.
- Missing reference to any prior phase file.
