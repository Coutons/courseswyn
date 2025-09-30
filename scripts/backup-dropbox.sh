#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
WORKDIR="/tmp/courseswyn-backup"
BACKUP_ROOT="/var/www/courseswyn/app"
DROPBOX_DIR="/CourseswynBackup"
DROPBOX_CONF="/var/www/courseswyn/.dropbox_uploader"

mkdir -p "$WORKDIR"
ARCHIVE="$WORKDIR/courseswyn-$TIMESTAMP.tar.gz"

tar --exclude="node_modules" \
    --exclude=".next/cache" \
    -czf "$ARCHIVE" -C "$BACKUP_ROOT" .

/usr/local/bin/dropbox_uploader -f "$DROPBOX_CONF" upload "$ARCHIVE" "$DROPBOX_DIR/"
rm -rf "$WORKDIR"
