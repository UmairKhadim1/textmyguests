    cd /home/forge/default
    git pull origin master
    composer install --no-interaction --no-dev --prefer-dist
    php artisan migrate --force



cd /home/forge/dev.textmyguests.com
git reset --hard
git pull origin dev
composer install --no-interaction --prefer-dist --optimize-autoloader
echo "" | sudo -S service php7.2-fpm reload

if [ -f artisan ]
then
    php artisan migrate --force
fi

yarn install
yarn development