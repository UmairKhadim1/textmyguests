<p>Hi, {{ $user }} your event "{{ $event->name }}" is expired.And your total number of guests of this event
    are {{ $event->guests()->count() }}.</p>
<p>Here is summary of messages send to guests : </p>
<div id="email" style="width:600px;">

    <table role="presentation" border="1" width="100%">
        <tr>
            <th>Message</th>
            <th>Message Time</th>
            <th>Message Recipients</th>
        </tr>

        @foreach ($messages as $msg)
            <tr>
                <td>{{ $msg->contents }}</td>
                <td>{{ $msg->send_at }}</td>
                <td>{{ $msg->recipients->count() }}</td>
            </tr>
        @endforeach

    </table>

</div>
