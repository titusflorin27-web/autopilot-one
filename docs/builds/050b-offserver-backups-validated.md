# BUILD #050B — Off-server backups validated on VPS

## Goal

Record the successful VPS validation for BUILD #050 and the follow-up compatibility fix needed for DigitalOcean Spaces limited-access keys.

## Scope

This build validates and polishes the off-server PostgreSQL backup workflow.

It does not change:

- API runtime behavior
- Web runtime behavior
- Database schema
- Authentication behavior
- Production secrets or environment files

## VPS validation summary

Validated on the production VPS from `/opt/autopilot-one`.

Confirmed:

- Latest local PostgreSQL backup is readable with the non-destructive verifier.
- `rclone` is installed on the VPS.
- DigitalOcean Spaces remote is configured outside the repository.
- Dry-run off-server sync completes successfully.
- Real off-server sync completes successfully.
- Off-server backup objects are visible in DigitalOcean Spaces.
- `latest.txt` exists remotely and points to the latest dump file.
- Off-server backup cron is installed.
- `cron` service is active.

Validated remote path:

```text
autopilot-offsite:autopilot-one-backups/autopilot-one/postgres
```

Validated remote files:

```text
autopilot_postgres_20260628T151100Z.dump
autopilot_postgres_20260629T031701Z.dump
autopilot_postgres_20260630T031701Z.dump
latest.txt
```

Validated latest marker:

```text
autopilot_postgres_20260630T031701Z.dump
```

Validated cron file:

```text
/etc/cron.d/autopilot-offsite-backup
```

Validated schedule:

```text
47 3 * * *
```

This runs after the local PostgreSQL backup cron, which defaults to `03:17` server time.

## Compatibility fix

DigitalOcean Spaces with limited-access keys accepted `rclone copy` but rejected `rclone copyto` for the marker file.

The sync script now writes `latest.txt` through a temporary local directory and `rclone copy`.

The script also no longer calls `rclone mkdir` for S3-compatible remotes. S3-compatible object storage does not have real directories, and the prefix is created automatically when objects are copied.

The dump-file copy now uses deterministic rclone filter rules instead of mixed `--include` and `--exclude` flags.

## Final clean validation

Final VPS validation completed at `2026-06-30T14:08:58Z` UTC.

Results:

```text
FINAL_SYNC_EXIT=0
autopilot_postgres_20260628T151100Z.dump
autopilot_postgres_20260629T031701Z.dump
autopilot_postgres_20260630T031701Z.dump
latest.txt
autopilot_postgres_20260630T031701Z.dump
Off-server backup sync completed
```

No new `AccessDenied` errors were observed after the final clean validation marker.

## Security notes

- No DigitalOcean Spaces keys are stored in this repository.
- Exposed test keys were revoked during setup.
- The active off-server backup key is configured only in the VPS-local rclone config.
- Do not paste access keys or secret keys into chat, screenshots, docs, issues, commits, logs, or pull requests.

## Remaining work

This validation confirms off-server backup sync and cron installation.

Still pending for launch hardening:

- Full restore test in a separate environment.
- External uptime monitoring and alerting.
- Backup failure alerting.
- Legal final polish.
- SEO launch polish.
- Final launch QA.
