#!/bin/bash
# install php dependencies
composer install

# configure the backend
bash configure.sh
