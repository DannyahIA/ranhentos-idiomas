# Etapa 1: Composer + PHP build
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

# Instala o Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Define diretório da aplicação
WORKDIR /var/www

# Copia o projeto
COPY . .

# Instala dependências
RUN composer install --no-dev --optimize-autoloader

# Gera chave da aplicação
RUN php artisan key:generate

# Cria banco de dados SQLite
RUN mkdir -p /data && touch /data/database.sqlite

# Ajusta permissões
RUN chmod -R 777 /data

# Porta de exposição (Render usa 10000)
EXPOSE 10000

# Comando de start
CMD php artisan migrate --force && php -S 0.0.0.0:10000 -t public
