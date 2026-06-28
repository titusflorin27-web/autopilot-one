#!/usr/bin/env sh
set -eu

SSH_PORT="${SSH_PORT:-}"
ENABLE_FIREWALL="${ENABLE_FIREWALL:-NO}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

section() {
  echo ""
  echo "=== $1 ==="
}

[ "$(id -u)" -eq 0 ] || fail "run as root"
command -v apt-get >/dev/null 2>&1 || fail "apt-get is required"

section "Install security packages"
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y ufw fail2ban unattended-upgrades apt-listchanges

section "Detect SSH port"
if [ -z "$SSH_PORT" ]; then
  if command -v sshd >/dev/null 2>&1; then
    SSH_PORT="$(sshd -T 2>/dev/null | awk '$1 == "port" { print $2; exit }')"
  fi
fi
SSH_PORT="${SSH_PORT:-22}"
echo "Using SSH port: $SSH_PORT"

section "Configure unattended security upgrades"
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
systemctl enable --now unattended-upgrades >/dev/null 2>&1 || true

section "Configure fail2ban SSH jail"
mkdir -p /etc/fail2ban/jail.d
cat > /etc/fail2ban/jail.d/autopilot-ssh.conf <<'EOF'
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = %(sshd_log)s
maxretry = 5
findtime = 10m
bantime = 1h
EOF
systemctl enable --now fail2ban
systemctl restart fail2ban

section "Configure UFW rules"
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow "$SSH_PORT/tcp" comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 443/udp comment 'HTTP3'

if [ "$ENABLE_FIREWALL" = "YES" ]; then
  section "Enable UFW firewall"
  echo "Enabling UFW now. SSH must already be allowed on port $SSH_PORT."
  ufw --force enable
else
  section "UFW not enabled yet"
  echo "Firewall rules were prepared but UFW was not enabled."
  echo "To enable after confirming SSH access, run:"
  echo "ENABLE_FIREWALL=YES sh scripts/vps-security-hardening.sh"
fi

section "Status"
ufw status verbose || true
systemctl is-active fail2ban || true
fail2ban-client status || true
fail2ban-client status sshd || true
systemctl is-active unattended-upgrades || true

echo "VPS security hardening completed."
