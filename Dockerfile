FROM php:7.4-fpm-alpine

ENV PROJECT_DIR /var/www

# Set working directory
WORKDIR ${PROJECT_DIR}

# Install dependencies
RUN apk update && apk add --no-cache \
    alpine-sdk \
    zlib-dev \
    libpng-dev \
    bash \
    shadow \
    bash-completion \
    vim \
    npm && \
    apk add --no-cache $PHPIZE_DEPS && \
    pecl install xdebug && \
    docker-php-ext-enable xdebug

# Install PHP Extensions
RUN docker-php-ext-install pdo \
    pdo_mysql \
    bcmath \
    fileinfo \
    gd

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Add user for application and create source directories and
# Copy existing application directory permissions
RUN groupadd -g 1000 www && \
    useradd -u 1000 -ms /bin/bash -g www www && \
    rm -r ${PROJECT_DIR}/html && \
    chown -R www:www ${PROJECT_DIR}

# Change current user to www
USER www

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
