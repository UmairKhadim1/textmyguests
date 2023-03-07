<!DOCTYPE html>
<html>
<head>
  <title>Pusher Test</title>
  <meta name="csrf-token" conent="{{ csrf_token() }}">

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
  <script src="https://js.pusher.com/7.0/pusher.min.js"></script>
  <!-- <script src="{{asset('js/index.js')}}"></script> -->

  <script src="{{asset('/js/pusher.js')}}"></script>
  <script>
    
    Pusher.logToConsole = true;
Echo.private('my-channel.1').listen('SendPusher', e => {
  
  //console.log(e);
  alert(JSON.stringify(e));
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