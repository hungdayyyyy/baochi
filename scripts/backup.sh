#!/bin/bash
# ==============================================================================
# Forbes.vn MongoDB Backup Script
# Performs daily compressed mongodump with 14-day retention policy
# ==============================================================================

set -euo pipefail

BACKUP_DIR="/backups/mongodb"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/forbes_vn_${TIMESTAMP}.gz"
RETENTION_DAYS=14

mkdir -p "${BACKUP_DIR}"

echo "[$(date)] Starting MongoDB backup for database 'forbes_vn'..."

# Execute mongodump directly inside the mongo container or host
docker compose exec -T mongo mongodump \
  --username "admin" \
  --password "${MONGO_ROOT_PASSWORD:-admin123}" \
  --authenticationDatabase "admin" \
  --db "forbes_vn" \
  --archive \
  --gzip > "${BACKUP_FILE}"

echo "[$(date)] Backup completed successfully: ${BACKUP_FILE} ($(du -h "${BACKUP_FILE}" | cut -f1))"

# Retention: Delete backups older than RETENTION_DAYS
echo "[$(date)] Pruning backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "forbes_vn_*.gz" -type f -mtime +${RETENTION_DAYS} -delete
echo "[$(date)] Prune complete."
