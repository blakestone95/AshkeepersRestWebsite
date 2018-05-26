@ECHO OFF

REM Put site in maintenance mode
php artisan down

REM Clear Compiled Classes
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan clear-compiled

REM Update git
git fetch -p
git pull

REM Install composer packages
call composer install --no-dev --optimize-autoloader

REM Clear and generate cache files
php artisan route:cache
php artisan config:cache

REM Compile css and js
call npm install
call npm run prod

REM Bring site out of maintenance mode
php artisan up

REM Restart queues
php artisan queue:restart
