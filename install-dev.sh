#!/bin/bash

# install JS dependencies
cd Ash.FrontEnd || exit
npm install

# Add precommit hooks
npm run add-precommit-docker

# Initial front end build so that app can run immediately
npm run build

cd ../

# install php dependencies
cd Ash.BackEnd || exit
composer install

# configure the backend
bash configure.sh
