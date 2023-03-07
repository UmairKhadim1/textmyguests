<p>Hi,</p>

<p>{{ $user }} your schedule message "{{ $msg->contents }}" is sended successfully to 
@foreach($msg->recipients as $group)
{{$group->group_name}}
<span>,</span>
@endforeach</p>