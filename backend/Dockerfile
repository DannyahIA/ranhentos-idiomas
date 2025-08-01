FROM php:8.2-cli

# Instala dependências
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    curl \
    sqlite3 \
    libsqlite3-dev \
    libzip-dev \
    zip \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Define diretório da aplicação
WORKDIR /var/www

# Copia arquivos do projeto
COPY . .

# Instala dependências PHP
RUN composer install --no-dev --optimize-autoloader

# Copia ou cria arquivo .env
RUN if [ -f .env.example ]; then cp .env.example .env; else touch .env; fi

# Gera chave da aplicação
RUN php artisan config:clear && php artisan key:generate

# Cria banco de dados SQLite
RUN mkdir -p /data && touch /data/database.sqlite && chmod -R 777 /data

# Expondo a porta padrão do Render
EXPOSE 10000

# Comando de execução
CMD php artisan migrate --force && php -S 0.0.0.0:10000 -t public
