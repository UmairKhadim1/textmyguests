<!DOCTYPE html>
<html lang="en">
@include('layouts.head')
<body data-spy="scroll" data-target=".navbar">
    
    @include('layouts.header')
    @yield('page')
    @include('layouts.footer')
    @include('layouts.scripts')
</body>
</html>
