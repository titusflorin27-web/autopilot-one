#!/usr/bin/env sh
set -eu

COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"

section() {
  echo ""
  echo "=== $1 ==="
}

run_optional() {
  echo "+ $*"
  "$@" || true
}

section "Host"
run_optional hostnamectl
run_optional date -u
run_optional whoami
run_optional uname -a

section "Project"
pwd
[ -f "$COMPOSE_FILE" ] && echo "Compose file found: $COMPOSE_FILE" || echo "Compose file missing: $COMPOSE_FILE"

section "Docker services"
run_optional docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
if [ -f "$COMPOSE_FILE" ]; then
  run_optional docker compose -f "$COMPOSE_FILE" ps
fi

section "Listening ports"
run_optional ss -tulpn

section "Firewall"
if command -v ufw >/dev/null 2>&1; then
  run_optional ufw status verbose
else
  echo "ufw not installed"
fi

section "SSH service"
run_optional systemctl is-active ssh
run_optional systemctl is-enabled ssh
if command -v sshd >/dev/null 2>&1; then
  echo "+ sshd -T selected settings"
  sshd -T 2>/dev/null | awk '$1 ~ /^(port|permitrootlogin|passwordauthentication|pubkeyauthentication|kbdinteractiveauthentication|challengeresponseauthentication|usepam)$/ { print }' || true
fi
if [ -f /etc/ssh/sshd_config ]; then
  echo "+ /etc/ssh/sshd_config selected non-comment settings"
  awk 'NF && $1 !~ /^#/ && tolower($1) ~ /^(port|permitrootlogin|passwordauthentication|pubkeyauthentication|kbdinteractiveauthentication|challengeresponseauthentication|usepam)$/ { print }' /etc/ssh/sshd_config || true
fi

section "Fail2ban"
if command -v fail2ban-client >/dev/null 2>&1; then
  run_optional systemctl is-active fail2ban
  run_optional fail2ban-client status
  run_optional fail2ban-client status sshd
else
  echo "fail2ban not installed"
fi

section "Unattended upgrades"
if command -v unattended-upgrade >/dev/null 2>&1; then
  run_optional systemctl is-active unattended-upgrades
  run_optional systemctl is-enabled unattended-upgrades
else
  echo "unattended-upgrades not installed"
fi
run_optional sh -c 'ls -1 /etc/apt/apt.conf.d/*auto* /etc/apt/apt.conf.d/*unattended* 2>/dev/null'

section "Backups"
run_optional systemctl is-active cron
run_optional test -f /etc/cron.d/autopilot-postgres-backup
run_optional cat /etc/cron.d/autopilot-postgres-backup
run_optional ls -lh /root/autopilot-backups/postgres
run_optional tail -n 40 /var/log/autopilot-postgres-backup.log

section "Disk and memory"
run_optional df -h
run_optional free -h

section "Security audit complete"
echo "This script is read-only and does not change server configuration."
