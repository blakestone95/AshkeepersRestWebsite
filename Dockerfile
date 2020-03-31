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
    npm \ 
    git && \
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
# RUN groupadd -g 1000 www && \
#     useradd -u 1000 -ms /bin/bash -g www www

# Remove unused directory
RUN rm -r ${PROJECT_DIR}/html

# Make node_modules work right
ENV NODE_PATH=/var/www/Ash.FrontEnd/node_modules/.bin

# Copy source directories and existing application directory permissions
# add --chown=www:www option if you can get user working properly
COPY Ash.BackEnd/ ${WORKDIR}/Ash.BackEnd
COPY Ash.FrontEnd/ ${WORKDIR}/Ash.FrontEnd
COPY install-dev.sh ${WORKDIR}/install-dev.sh
COPY githooks ${WORKDIR}/githooks
COPY .git ${WORKDIR}/.git

# Change current user to www
# USER www

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
