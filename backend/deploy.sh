#!/bin/bash

# Render build script
echo "Starting Laravel deployment on Render..."

# Install dependencies
composer install --optimize-autoloader --no-dev

# Generate application key if not exists
if [ ! -f .env ]; then
    cp .env.production .env
fi

# Generate key if not exists
php artisan key:generate --force

# Create database if not exists
touch database/database.sqlite

# Run migrations and seeders
php artisan migrate --force
php artisan db:seed --force

# Clear and cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Laravel deployment completed!"
