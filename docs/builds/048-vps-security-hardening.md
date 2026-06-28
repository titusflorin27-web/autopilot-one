# BUILD #048 — VPS security hardening

## Goal

Harden the production VPS without risking accidental lockout.

## Scope

This build adds scripts and documentation only. The scripts must be run manually on the VPS by the operator.

No application runtime, database schema, widget token, auth flow or CRM behavior is changed by this PR.

## Files

- `scripts/vps-security-audit.sh`
- `scripts/vps-security-hardening.sh`
- `docs/builds/048-vps-security-hardening.md`

## Step 1 — Run the read-only audit

From `/opt/autopilot-one`:

```bash
sh scripts/vps-security-audit.sh
```

This script is read-only. It prints:

- Docker service status
- listening ports
- UFW status
- SSH selected settings
- fail2ban status
- unattended-upgrades status
- backup cron status
- disk and memory status

## Step 2 — Install hardening packages and prepare firewall rules

Run as root:

```bash
sh scripts/vps-security-hardening.sh
```

This installs/configures:

- `ufw`
- `fail2ban`
- `unattended-upgrades`
- daily APT security updates
- SSH fail2ban jail
- UFW allow rules for SSH, HTTP, HTTPS and HTTP/3

By default, this does **not** enable UFW. It prepares rules only.

## Step 3 — Verify SSH before enabling firewall

Open a second SSH session to the VPS and confirm it works.

Do not close the first session.

Then check UFW prepared rules:

```bash
ufw status verbose
```

## Step 4 — Enable firewall only after SSH is confirmed

```bash
ENABLE_FIREWALL=YES sh scripts/vps-security-hardening.sh
```

The script allows:

- SSH on the detected `sshd` port, default `22/tcp`
- HTTP `80/tcp`
- HTTPS `443/tcp`
- HTTP/3 `443/udp`

## Step 5 — Validate production after firewall

```bash
curl -i https://api.autopilot-one.com/api/health
curl -I https://app.autopilot-one.com
docker compose -f infrastructure/docker-compose.vps.example.yml ps
ufw status verbose
fail2ban-client status
fail2ban-client status sshd
```

Expected result:

- API returns `HTTP/2 200`
- Web returns `HTTP/2 200`
- Docker containers are running
- UFW is active
- fail2ban jail `sshd` is active

## Safety rules

- Never enable firewall before confirming the SSH allow rule.
- Keep the current SSH session open while testing a second SSH session.
- Do not disable root login or password auth unless SSH key access is confirmed and tested.
- Do not expose Postgres or Redis publicly.
- Keep `/root/autopilot-backups/postgres` protected.
