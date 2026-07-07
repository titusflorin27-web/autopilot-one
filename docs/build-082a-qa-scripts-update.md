# Build 082A - QA Scripts Update

## Purpose

Update the official VPS live QA script for the current demo-first public website strategy.

## Changes

- Remove the old homepage expectation for `Creează cont`.
- Require the homepage to expose `Cere demo`, `Vezi planurile` and the trust CTA.
- Add `/trust` and `/billing` to route status checks.
- Verify the pricing controlled activation copy.
- Verify the Trust page copy.
- Verify `/trust` is present in the sitemap.
- Keep API health and fresh Docker log checks.

## Reason

After Build 080B, the public flow changed from account-first to demo-first. The old QA script correctly detected that `Creează cont` was missing, but that became a false failure. This build makes the deployment QA match the current product strategy.

## Expected final marker

`=== DEMO-FIRST QA PASSED ===`
