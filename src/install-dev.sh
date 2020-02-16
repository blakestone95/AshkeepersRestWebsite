#!/bin/bash

npm install --prefix Ash.FrontEnd
npm run --prefix Ash.FrontEnd build

# install php dependencies
composer install -d Ash.BackEnd
# configure the backend
cd Ash.BackEnd || exit

./configure.sh
