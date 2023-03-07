<section class="real-events-content" id="real-events">
	<div class="container">
		<div class="row justify-content-center">
			<!-- <div class="col-12 col-md-10">
				<p class="real-events-description text-center">
					Remember, as the host, your guests receive all messages you send
					but their replies are only sent back to you. Replies can also be
					seen on the private Reply Stream URL that you'll get when you create
					your event. Share the URL with your guests so they can interact with
					each other!
				</p>
			</div> -->
			<div class="col-12">

				<script>
					function toggleEventMessages(eventId) {
						$('#' + eventId).slideToggle();
					}
				</script>

				<!-- FIRST EVENT -->
				<div class="real-event-container">
					<div class="real-event-header">
						<h5 class="real-event-title">
							<span>Celebration in the City</span>&nbsp;&nbsp;|&nbsp;&nbsp;
							An urban wedding that goes big on music and entertainment!
						</h5>

						<div class="toggle-button" style="text-align: center; margin-left: 0px;">
							<button onclick="toggleEventMessages('event1')">Show/Hide</button>
						</div>
					</div>

					<div class="real-event-messages-container" id="event1" style="display: none;">
						<div class="stream-container">
							@component('partials.realeventmessage')
							Welcome to our wedding in the windy city! We will update you on wedding details with texts throughout the weekend. Can’t wait to see you all soon! -Ben & Sophia
							@slot('from')
							Sophia L.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 6:30 PM</span>
							<span class="d-none d-md-inline">Friday, 6:30 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/plane.jpg'
							])
							Almost there! Can't wait to see everyone on the ground in Chicago!
							@slot('from')
							Joe T.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 8:13 PM</span>
							<span class="d-none d-md-inline">Friday, 8:13 PM</span>
							@endslot
							@endcomponent


							@component('partials.realeventmessage')
							Please text your pictures and messages to this number, we would love to see what you’re up to this weekend in Chicago!
							@slot('from')
							Sophia L.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 7:30 PM</span>
							<span class="d-none d-md-inline">Friday, 7:30 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							We hope you enjoy your free time today! The Hilton concierge can help plan your sightseeing. Tell them you are with the Hutchins wedding for the best service.
							@slot('from')
							Sophia L.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 10:00 AM</span>
							<span class="d-none d-md-inline">Saturday, 10:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							A bunch of us are leaving from the hotel in 10 to walk around the city!
							@slot('from')
							Brandi S.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 12:50 PM</span>
							<span class="d-none d-md-inline">Saturday, 12:50 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							Reminder that the ceremony starts at 6:00 PM in the Grand Ballroom. If you’re staying at the Hilton, just take the elevator to the third floor.
							@slot('from')
							Sophia L.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 2:00 PM</span>
							<span class="d-none d-md-inline">Saturday, 2:00 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							If you're heading into the city, we recommend taking the light rail to avoid traffic and parking. The Uptown Hilton is one block from the 45th Street stop.
							@slot('from')
							Sophia L.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 2:05 PM</span>
							<span class="d-none d-md-inline">Saturday, 2:05 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/chicago.jpg'
							])
							Basic Chicago tourist right here 😊
							@slot('from')
							Casey O.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 3:40 PM</span>
							<span class="d-none d-md-inline">Saturday, 3:40 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/ballroom.jpg'
							])
							Snuck this pic of the ballroom and it already looks fab!! 😍
							@slot('from')
							Jennifer M.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 5:04 PM</span>
							<span class="d-none d-md-inline">Saturday, 5:04 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							Cocktail hour has begun in the atrium. While you mingle, shoot us any music requests you have for tonight. We will pass the top picks along to the band!
							@slot('from')
							Sophia L.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 6:45 PM</span>
							<span class="d-none d-md-inline">Saturday, 6:45 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Please play Whitney Houston I Wanna Dance with Somebody! Best song ever
							@slot('from')
							Jennifer M.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 7:05 PM</span>
							<span class="d-none d-md-inline">Saturday, 7:05 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Walk the Moon always gets the party started
							@slot('from')
							Leo K.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 7:12 PM</span>
							<span class="d-none d-md-inline">Saturday, 7:12 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							NOT the electric slide…
							@slot('from')
							John D.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 7:34 PM</span>
							<span class="d-none d-md-inline">Saturday, 7:34 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Freebird!!! Haha
							@slot('from')
							Jess N.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 7:38 PM</span>
							<span class="d-none d-md-inline">Saturday, 7:38 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/dance.jpg'
							])
							Gorgeous couple 💛
							@slot('from')
							Carrie R.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 9:02 PM</span>
							<span class="d-none d-md-inline">Saturday, 9:02 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							Just because the wedding is over doesn’t mean the night has to end! Join us for another round at McCallister’s Pub on Hay Road.
							@slot('from')
							Sophia L.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 11:30 PM</span>
							<span class="d-none d-md-inline">Saturday, 11:30 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							We hope everyone has recovered from yesterday! We’d love to say goodbye before you leave town, catch us having brunch in the hotel café starting at 11 o’clock.
							@slot('from')
							Sophia L.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 10:00 AM</span>
							<span class="d-none d-md-inline">Sunday, 10:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							I had to leave before saying goodbye, but I’ll see you two when you get back from Italy. Cheers!!
							@slot('from')
							Greg P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 11:43 AM</span>
							<span class="d-none d-md-inline">Sunday, 11:43 AM</span>
							@endslot
							@endcomponent
						</div>
					</div>
				</div>

				<!-- SECOND EVENT -->
				<div class="real-event-container">
					<div class="real-event-header">
						<h5 class="real-event-title">
							<span>Charming Ceremony</span>&nbsp;&nbsp;|&nbsp;&nbsp;
							This church ceremony is followed by a classy cocktail hour in the rose garden
						</h5>

						<div class="toggle-button" style="text-align: center; margin-left: 0px;">
							<button onclick="toggleEventMessages('event2')">Show/Hide</button>
						</div>
					</div>

					<div class="real-event-messages-container" id="event2" style="display: none;">
						<div class="stream-container">
							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							The bride can’t wait to greet you at the Bride’s Luncheon today at 1:00 PM. The address is 66 Carriage Ave and the dress code is casual. See you there!
							@slot('from')
							Jenn S.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 9:30 AM</span>
							<span class="d-none d-md-inline">Friday, 9:30 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Yay it’s finally Jenn’s wedding weekend!! See ya at the luncheon 😀
							@slot('from')
							Tina G.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 9:38 AM</span>
							<span class="d-none d-md-inline">Friday, 9:38 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							What time does the rehearsal at the church begin?
							@slot('from')
							Jamie M.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 2:10 PM</span>
							<span class="d-none d-md-inline">Friday, 2:10 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							The rehearsal is at 4:30 PM at Bellevue Methodist Church. We will start on time so please be prompt! You should plan to head to the Rehearsal Dinner afterwards.
							@slot('from')
							Jenn S.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 2:30 PM</span>
							<span class="d-none d-md-inline">Friday, 2:30 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							Happy wedding day! We are so thrilled that our special day has finally arrived. We can’t wait to say “I do” and celebrate with you! -Jenn & Art
							@slot('from')
							Jenn S.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 10:00 AM</span>
							<span class="d-none d-md-inline">Saturday, 10:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							Reminder that the ceremony begins at 3:00 PM today. The address is 1200 Lilac Drive. There is plenty of parking available adjacent to the church.
							@slot('from')
							Jenn S.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 11:00 AM</span>
							<span class="d-none d-md-inline">Saturday, 11:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/friends.jpg'
							])
							The Middletown High School crew is back together for Jenn’s big day!
							@slot('from')
							Katherine C.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 12:02 PM</span>
							<span class="d-none d-md-inline">Saturday, 12:02 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Great day for a wedding - break a leg Art buddy 👊
							@slot('from')
							Jake D.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 2:16 PM</span>
							<span class="d-none d-md-inline">Saturday, 2:16 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							The ceremony will begin soon. We ask that you please take this time to make sure your phones are on silent.
							@slot('from')
							Jenn S.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 2:40 PM</span>
							<span class="d-none d-md-inline">Saturday, 2:40 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							Cocktail hour is starting now in the rose garden. Enjoy each other’s company while we take wedding photos and we will join you soon.
							@slot('from')
							Jenn S.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 4:00 PM</span>
							<span class="d-none d-md-inline">Saturday, 4:00 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/bride_groom.jpg'
							])
							When you’re lucky enough to have a front row seat, you snag a pic of the bride and groom!
							@slot('from')
							Sam B.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 4:05 PM</span>
							<span class="d-none d-md-inline">Saturday, 4:05 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Wow great shot Sam! The ceremony was perfect 👌
							@slot('from')
							Tracy J.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 4:10 PM</span>
							<span class="d-none d-md-inline">Saturday, 4:10 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							We had the best time celebrating with you yesterday, thank you for being a part of it! Please send your photos to this number so we can enjoy them. We love you!
							@slot('from')
							Jenn S.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 10:00 AM</span>
							<span class="d-none d-md-inline">Sunday, 10:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/ceremony.jpg'
							])
							Who says the nosebleed seats have a bad view?!
							@slot('from')
							Bill L.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 10:12 AM</span>
							<span class="d-none d-md-inline">Sunday, 10:12 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/garden.jpg'
							])
							Here you go!
							@slot('from')
							Jerry A.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 10:27 AM</span>
							<span class="d-none d-md-inline">Sunday, 10:27 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Love you guys so much, congrats again and enjoy the honeymoon!
							@slot('from')
							Sam B.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 11:20 AM</span>
							<span class="d-none d-md-inline">Sunday, 11:20 AM</span>
							@endslot
							@endcomponent
						</div>
					</div>
				</div>


				<!-- THIRD EVENT -->
				<div class="real-event-container">
					<div class="real-event-header">
						<h5 class="real-event-title">
							<span>Intimate Affair</span>&nbsp;&nbsp;|&nbsp;&nbsp;
							This small wedding has the personal touch of being hosted on the family farm
						</h5>

						<div class="toggle-button" style="text-align: center; margin-left: 0px;">
							<button onclick="toggleEventMessages('event3')">Show/Hide</button>
						</div>
					</div>

					<div class="real-event-messages-container" id="event3" style="display: none;">
						<div class="stream-container">
							@component('partials.realeventmessage')
							Welcome to our wedding, we’re so glad you’re here! Be on the lookout for text updates throughout the weekend. ~Sandy & Michael
							@slot('from')
							Michael P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 10:00 AM</span>
							<span class="d-none d-md-inline">Saturday, 10:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							We’d love you to send us photos and messages, just reply back to this number from your phone!
							@slot('from')
							Michael P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 10:10 AM</span>
							<span class="d-none d-md-inline">Saturday, 10:10 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Very cool, will definitely send you some pics. Happy wedding!
							@slot('from')
							Shane F.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 10:20 AM</span>
							<span class="d-none d-md-inline">Saturday, 10:20 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							Hi bridesmaids and groomsmen! Please be at the farm for group photos at noon - we will meet behind the barn. Our photographer thanks you for being on time 😊
							@slot('from')
							Michael P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 11:15 AM</span>
							<span class="d-none d-md-inline">Saturday, 11:15 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							The bridesmaids are driving over together, we will be there in 10
							@slot('from')
							Jocelyn D.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 11:43 AM</span>
							<span class="d-none d-md-inline">Saturday, 11:43 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							Our ceremony is outside and there’s rain in the forecast. Please bring an umbrella or hooded jacket just to be safe.
							@slot('from')
							Michael P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 1:00 PM</span>
							<span class="d-none d-md-inline">Saturday, 1:00 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							Transportation to the farm departs from the Courtyard at 2:30 PM. There is only a single departure. For those driving, the address is 3770 Brentwood Road.
							@slot('from')
							Michael P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 1:30 PM</span>
							<span class="d-none d-md-inline">Saturday, 1:30 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/van.jpg'
							])
							How cute is this getaway car parked behind the barn?? Love it!!
							@slot('from')
							Crystal H.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 3:11 PM</span>
							<span class="d-none d-md-inline">Saturday, 3:11 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							No rain yet, I think we are in the clear. Hopefully won’t need these umbrellas after all
							@slot('from')
							Devin N.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 3:27 PM</span>
							<span class="d-none d-md-inline">Saturday, 3:27 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/bride_groom_2.jpg'
							])
							Sneaky pic of the bride and groom 😉 You guys are the cutest
							@slot('from')
							Taylor W.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 5:14 PM</span>
							<span class="d-none d-md-inline">Saturday, 5:14 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/tent.jpg'
							])
							What a great night so far - now it’s time to hit the dance floor!
							@slot('from')
							Shane F.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 7:20 PM</span>
							<span class="d-none d-md-inline">Saturday, 7:20 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							Hey everyone, we have a special surprise starting soon - fireworks!! Head to the north end of the tent for the best view!
							@slot('from')
							Michael P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 8:00 PM</span>
							<span class="d-none d-md-inline">Saturday, 8:00 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/fireworks.jpg'
							])
							Fireworks were on point! 🎇
							@slot('from')
							David R.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 9:33 PM</span>
							<span class="d-none d-md-inline">Saturday, 9:33 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							Transportation to the hotel departs at 10:30 PM, please be on the bus before then if you wish to take it.
							@slot('from')
							Michael P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 10:00 PM</span>
							<span class="d-none d-md-inline">Saturday, 10:00 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage')
							The mother of the groom has graciously invited you to her home for a farewell brunch. Come say goodbye before the bride and groom take off for Paris!
							@slot('from')
							Michael P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 9:00 AM</span>
							<span class="d-none d-md-inline">Sunday, 9:00 AM</span>
							@endslot
							@endcomponent
						</div>
					</div>
				</div>

				<!-- FOURTH EVENT -->
				<div class="real-event-container" style="margin-bottom: 0px;">
					<div class="real-event-header">
						<h5 class="real-event-title">
							<span>Tropical Destination</span>&nbsp;&nbsp;|&nbsp;&nbsp;
							Nuptials on the beach then dinner and dancing until the sun goes down!
						</h5>

						<div class="toggle-button" style="text-align: center; margin-left: 0px;">
							<button onclick="toggleEventMessages('event4')">Show/Hide</button>
						</div>
					</div>

					<div class="real-event-messages-container" id="event4" style="display: none; margin-bottom: 20px;">
						<div class="stream-container">
							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							It’s Annie and Brandon, welcome to our beach wedding celebration! Anyone who has arrived already is welcome to join us at the main hotel bar for a drink!
							@slot('from')
							Brandon P.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 7:00 PM</span>
							<span class="d-none d-md-inline">Friday, 7:00 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							We just got to the resort - wow this place is incredible. Is this a vacation or a wedding?!
							@slot('from')
							Randy C.
							@endslot
							@slot('time')
							<span class="d-md-none">Fri, 8:40 PM</span>
							<span class="d-none d-md-inline">Friday, 8:40 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							We hate to miss a moment - please send your photos to this number throughout the weekend so we can keep up with you!
							@slot('from')
							Brandon P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 9:00 AM</span>
							<span class="d-none d-md-inline">Saturday, 9:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Can’t wait, see y’all at the pool. I’ll be the one with a drink in my hand 🍹
							@slot('from')
							Jackson E.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 9:12 AM</span>
							<span class="d-none d-md-inline">Saturday, 9:12 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							We want you all to relax and have fun while you’re here - make sure you enjoy the resort today! The pool and beach are open and the weather is perfect 🌞
							@slot('from')
							Brandon P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 10:00 AM</span>
							<span class="d-none d-md-inline">Saturday, 10:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							Reminder to please be on the private beach behind the pool bar at 5:00 PM in time for the ceremony. We will be on sand, so please wear flat shoes.
							@slot('from')
							Brandon P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 11:00 AM</span>
							<span class="d-none d-md-inline">Saturday, 11:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/lunch.jpg'
							])
							Just a casual lunch with the boys
							@slot('from')
							Taylor W.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 12:48 PM</span>
							<span class="d-none d-md-inline">Saturday, 12:48 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/girls_lunch.jpg'
							])
							Here’s the girls version! Much classier than the boys, as usual 😂
							@slot('from')
							Shawna S.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 1:13 PM</span>
							<span class="d-none d-md-inline">Saturday, 1:13 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/pool.jpg'
							])
							Someone move that duck, it’s blocking my million-dollar view!
							@slot('from')
							Jackson E.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 3:32 PM</span>
							<span class="d-none d-md-inline">Saturday, 3:32 PM</span>
							@endslot
							@endcomponent



							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							The ceremony begins in 30 minutes. We ask that you please silence your phones and refrain from taking pictures during the ceremony. We appreciate it. Time to get married!
							@slot('from')
							Brandon P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 4:30 PM</span>
							<span class="d-none d-md-inline">Saturday, 4:30 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', [
							'type' => 'reply',
							'image' => 'https://textmyguests.s3.amazonaws.com/landing/realevents/beach.jpg'
							])
							No words to describe how beautiful this is!!
							@slot('from')
							Lena B.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 4:40 PM</span>
							<span class="d-none d-md-inline">Saturday, 4:40 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							Enjoy cocktail hour on the rooftop deck while we take some photos! Dinner will be served downstairs in the main dining room in one hour.
							@slot('from')
							Brandon P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 5:50 PM</span>
							<span class="d-none d-md-inline">Saturday, 5:50 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							Please join us on the dance floor - the bar is open and the band will be playing until 11 o’clock! Let’s party!!
							@slot('from')
							Brandon P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 8:00 PM</span>
							<span class="d-none d-md-inline">Saturday, 8:00 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							Bunch of us are at the hotel bar and someone ordered pizza, come on down!
							@slot('from')
							Thomas P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sat, 11:37 PM</span>
							<span class="d-none d-md-inline">Saturday, 11:37 PM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['bg' => 'bg-2'])
							We can’t believe how lucky we are to have friends and family who traveled all this way to celebrate with us. We can’t thank you enough. Travel home safely, we love you 💗
							@slot('from')
							Brandon P.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 10:00 AM</span>
							<span class="d-none d-md-inline">Sunday, 10:00 AM</span>
							@endslot
							@endcomponent

							@component('partials.realeventmessage', ['type' => 'reply'])
							We are on our way to the airport now! We love you both, see you soon!
							@slot('from')
							Allison T.
							@endslot
							@slot('time')
							<span class="d-md-none">Sun, 10:07 AM</span>
							<span class="d-none d-md-inline">Sunday, 10:07 AM</span>
							@endslot
							@endcomponent
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</section>