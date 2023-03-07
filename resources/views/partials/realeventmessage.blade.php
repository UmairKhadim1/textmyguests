<div class="real-event-message {{ $type ?? '' }}">
	<div class="body-container {{ $bg ?? '' }}">
		<div>
			@if (isset($image))
			<div class="image-container">
				<img src="{{ $image }}" />
			</div>
			@endif

			<div class="body">
				<div>{{ $slot }}</div>
			</div>
		</div>
	</div>

	<div class="info">
		<span class="sender">
			&mdash;&nbsp; {{ $from }}&nbsp;
			<!-- <span class="from-host">(host)</span> -->
		</span>
		<span class="send-time">
			{{ $time }}
		</span>
	</div>
</div>