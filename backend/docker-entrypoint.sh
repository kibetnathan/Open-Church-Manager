#!/usr/bin/env sh
set -e

wait_for_db() {
  echo "Waiting for PostgreSQL..."
  python - <<'PY'
import os, sys, time
import psycopg2

db = {
    "dbname": os.getenv("POSTGRES_DB", "cmsdb"),
    "user": os.getenv("POSTGRES_USER", "postgres"),
    "password": os.getenv("POSTGRES_PASSWORD", ""),
    "host": os.getenv("POSTGRES_HOST", "db"),
    "port": os.getenv("POSTGRES_PORT", "5432"),
}

for _ in range(60):
    try:
        psycopg2.connect(**db).close()
        print("PostgreSQL is ready.")
        sys.exit(0)
    except Exception:
        time.sleep(1)

print("PostgreSQL did not become ready in time.", file=sys.stderr)
sys.exit(1)
PY
}

wait_for_db

python manage.py migrate --noinput
python manage.py collectstatic --noinput

if [ -n "$BACKEND_ADMIN_PASSWORD" ]; then
  python manage.py createsuperuser --noinput \
    --username "${BACKEND_ADMIN_USERNAME:-nero}" \
    --email "${BACKEND_ADMIN_EMAIL:-backend@example.com}" 2>/dev/null || true
  python - <<'PY'
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "church.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
username = os.getenv("BACKEND_ADMIN_USERNAME", "nero")
password = os.getenv("BACKEND_ADMIN_PASSWORD")
user = User.objects.filter(username=username).first()
if user:
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"Admin '{username}' is ready.")
PY
fi

exec "$@"