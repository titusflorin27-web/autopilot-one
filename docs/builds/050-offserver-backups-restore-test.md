# BUILD #050 — Off-server backups and restore test

## Goal

Add the operational workflow for copying PostgreSQL backups outside the VPS and verifying that backup files are readable before a real restore is needed.

## Scope

This build adds scripts and documentation only.

It does not change:

- API runtime behavior
- Web runtime behavior
- Database schema
- Widget token behavior
- Auth behavior
- CRM behavior
- Environment files
- Secrets

## Files

- `scripts/vps-install-rclone.sh`
- `scripts/vps-sync-backups-offsite.sh`
- `scripts/vps-install-offsite-backup-cron.sh`
- `scripts/vps-verify-postgres-backup.sh`
- `docs/builds/050-offserver-backups-restore-test.md`

## Off-server backup approach

The VPS already creates local PostgreSQL backup dumps under:

```text
/root/autopilot-backups/postgres
```

BUILD #050 adds an off-server sync layer using `rclone`.

The repository does not contain remote credentials. Configure the remote only on the VPS.

Supported destinations include any `rclone` backend, for example:

- DigitalOcean Spaces
- AWS S3
- Cloudflare R2
- Backblaze B2
- Google Drive
- SFTP storage

## Install rclone

Run as root:

```bash
sh scripts/vps-install-rclone.sh
```

Then configure a private remote:

```bash
rclone config
```

Example remote target format:

```text
autopilot-offsite:autopilot-one/postgres
```

Do not commit or paste remote access keys.

## Verify the current local backup

Run from `/opt/autopilot-one`:

```bash
sh scripts/vps-verify-postgres-backup.sh
```

This verifies the latest local backup by running `pg_restore --list` inside the Postgres container.

It does not overwrite or restore any database.

## Manual off-server sync

Run from `/opt/autopilot-one` after configuring `rclone`:

```bash
OFFSITE_REMOTE=autopilot-offsite:autopilot-one/postgres sh scripts/vps-sync-backups-offsite.sh
```

The script copies real `autopilot_postgres_*.dump` files and writes a small `latest.txt` marker with the latest backup filename.

Dry-run mode:

```bash
DRY_RUN=YES OFFSITE_REMOTE=autopilot-offsite:autopilot-one/postgres sh scripts/vps-sync-backups-offsite.sh
```

Default log file:

```text
/var/log/autopilot-offsite-backup.log
```

## Install off-server backup cron

After manual sync succeeds, install the cron:

```bash
OFFSITE_REMOTE=autopilot-offsite:autopilot-one/postgres sh scripts/vps-install-offsite-backup-cron.sh
```

Default schedule:

```text
47 3 * * *
```

This runs after the local PostgreSQL backup cron, which defaults to `03:17`.

## Validate off-server files

```bash
rclone lsf autopilot-offsite:autopilot-one/postgres
rclone cat autopilot-offsite:autopilot-one/postgres/latest.txt
```

Expected result:

- at least one `autopilot_postgres_*.dump` file
- `latest.txt` containing the latest dump filename

## Restore test policy

The repository includes a non-destructive backup verification script.

A full restore test should be done in a separate environment or an explicitly isolated test database. Do not run a destructive restore against the production database.

Safe restore-test approach:

1. Provision a separate test database or separate temporary Postgres container.
2. Download one off-server backup file into that environment.
3. Run `pg_restore --list` first.
4. Restore into the test database only.
5. Confirm expected tables exist.
6. Destroy the temporary restore environment.

## Current limitation

This build does not send external alerts when off-server sync fails. That should be covered by a later alerting build.
