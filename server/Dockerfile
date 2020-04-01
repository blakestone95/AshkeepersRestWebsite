FROM php:7.4-fpm-alpine

# Set working directory
ENV PROJECT_DIR /var/www
WORKDIR ${PROJECT_DIR}

# Install dependencies
RUN apk update && apk add --no-cache \
    alpine-sdk \
    zlib-dev \
    libpng-dev \
    bash \
    shadow \
    bash-completion \
    vim && \
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

# Add user to run server
RUN groupadd -g 1000 www && \
    useradd -u 1000 -ms /bin/bash -g www www

# Remove unused directory
RUN rm -r ${PROJECT_DIR}/html

# Copy source directories
# add --chown=www:www option if you can get user working properly
COPY --chown=www:www . ${WORKDIR}/server

# Correct permission for vendor
RUN mkdir -p ${PROJECT_DIR}/server/vendor \
  && chown www:www -R ${PROJECT_DIR}/server/vendor \
  && chmod 777 -R ${PROJECT_DIR}/server/vendor
VOLUME [ "${PROJECT_DIR}/server/vendor" ]

# Change current user to www
USER www

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
