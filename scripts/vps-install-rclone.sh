#!/usr/bin/env sh
set -eu

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

[ "$(id -u)" -eq 0 ] || fail "run as root"

if command -v rclone >/dev/null 2>&1; then
  echo "rclone already installed: $(rclone version | head -n 1)"
  exit 0
fi

if command -v apt-get >/dev/null 2>&1; then
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y rclone
else
  fail "apt-get is required to install rclone automatically"
fi

rclone version | head -n 1
