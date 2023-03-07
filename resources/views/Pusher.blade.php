<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://js.pusher.com/7.0/pusher.min.js"></script>
    <script src="{{ asset('js/echo.iife.js') }}"></script>
    <script src="{{ asset('js/echo.js') }}"></script>
    <script>
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        window.Echo = new Echo({
            authEndpont: 'http://127.0.0.1:8000/broadcasting/auth',
            broadcaster: 'pusher',
            key: '5468e31b2f4e6c4b6afe',
            cluster: 'ap1',
            forceTLS: true
        });
    </script>
    <script>
        Echo.private('user.{{ $user->id }}')
            .listen('EndUser', (e) => {
                alert(e.user);
            });
    </script>
</head>

<body>
    <h1>Pusher Test</h1>
    <p>
        Try publishing an event to channel <code>my-channel</code>
        with event name <code>my-event</code>.
    </p>
</body>

</html>
