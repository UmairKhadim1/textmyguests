<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-136068310-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-136068310-1');
    </script>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="theme-color" content="#000000">
    <meta name="csrf-token" conent="{{ csrf_token() }}">

    <meta property="og:title" content="Join {{ $shindig->name }} on TextMyGuests" />
    <meta property="og:image" content="{{ env('APP_URL') }}/assets/images/live/TMG_og_image.jpg" />
    <meta property="og:description" content="Get real-time text updates from your host about what’s happening at {{ $shindig->name }}!" />
    <meta property="og:site_name" content="TextMyGuests">
    <meta property="twitter:card" content="summary_large_image" />
    <meta name="twitter:image:alt" content="TextMyGuests.com">

    <!--
      manifest.json provides metadata used when your web app is added to the
      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
    -->
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
    <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700" rel="stylesheet" async>
    <link async rel="stylesheet" href="/css/ionicons.min.css">
    <link rel="stylesheet" href="/css/app.css">

    <title>{{ $shindig->name }} | TextMyGuests</title>

    <script type="text/javascript">
      // This is for the api
      window.appUrl = '{{ env('APP_URL') }}';
      window.csrfToken = '{{ csrf_token() }}';
    </script>
  </head>
  <body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div>
    <script type="text/javascript" src="{{ mix('/js/indexPublic.js') }}"></script>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
    -->
  </body>
</html>
