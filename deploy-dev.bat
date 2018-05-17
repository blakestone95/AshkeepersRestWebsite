@ECHO OFF

REM Put site in maintenance mode
php artisan down

REM Clear Compiled Classes
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan clear-compiled

REM Update git
git fetch -p
git pull

REM Install composer packages
call composer install

REM Compile css and js
call npm install
call npm run dev

REM Bring site out of maintenance mode
php artisan up
