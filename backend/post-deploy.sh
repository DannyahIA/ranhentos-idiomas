#!/usr/bin/env bash

echo "----> Laravel setup started"

# Generate app key if not exists
if [ -z "$APP_KEY" ]; then
    echo "----> Generating app key"
    php artisan key:generate --force
fi

echo "----> Creating database"
touch database/database.sqlite

echo "----> Running migrations"
php artisan migrate --force

echo "----> Seeding database"
php artisan db:seed --force

echo "----> Caching configuration"
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "----> Laravel setup completed"
