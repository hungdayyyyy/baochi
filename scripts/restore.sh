#!/bin/bash
# ==============================================================================
# Forbes.vn MongoDB Restore Script
# Restores a compressed mongodump archive created by backup.sh
# Usage: ./scripts/restore.sh /path/to/forbes_vn_YYYYMMDD_HHMMSS.gz
# ==============================================================================

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <path-to-backup-archive.gz>"
  echo "Example: $0 /backups/mongodb/forbes_vn_20261018_120000.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "Error: Backup file '${BACKUP_FILE}' does not exist."
  exit 1
fi

echo "WARNING: This will drop and overwrite the current 'forbes_vn' database with contents from ${BACKUP_FILE}."
read -p "Are you sure you want to proceed? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
  echo "Restore aborted."
  exit 0
fi

echo "[$(date)] Restoring MongoDB database 'forbes_vn'..."

cat "${BACKUP_FILE}" | docker compose exec -T mongo mongorestore \
  --username "admin" \
  --password "${MONGO_ROOT_PASSWORD:-admin123}" \
  --authenticationDatabase "admin" \
  --nsInclude="forbes_vn.*" \
  --archive \
  --gzip \
  --drop

echo "[$(date)] Database restored successfully!"
