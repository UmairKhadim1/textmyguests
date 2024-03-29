/* eslint-disable no-undef */
let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/assets/js/index.js', 'public/js');
mix.react('resources/assets/js/indexPublic.js', 'public/js');
mix.js('resources/assets/js/pusher.js', 'public/js');