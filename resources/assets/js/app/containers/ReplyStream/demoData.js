import Moment from 'moment';
import { s3Config } from '../../config';

const replies = [
  {
    id: 'r_5',
    type: 'reply',
    received_at: '2019-09-28T10:20:06.000',
    media: [],
    body:
      'Aunt Lori and I had a great time thank you very much for your hospitality',
    sender: 'Robbie C.',
  },
  {
    id: 'r_6',
    type: 'reply',
    received_at: '2019-09-28T10:15:06.000',
    medias: [
      {
        id: 2,
        url: s3Config.urlPrefix + 'demo/wedding5.jpg',
      },
      {
        id: 3,
        url: s3Config.urlPrefix + 'demo/wedding4.jpg',
      },
      {
        id: 4,
        url: s3Config.urlPrefix + 'demo/wedding3.jpg',
      },
      {
        id: 5,
        url: s3Config.urlPrefix + 'demo/wedding2.jpg',
      },
      {
        id: 5,
        url: s3Config.urlPrefix + 'demo/wedding1.jpg',
      },
    ],
    body:
      'A few pictures I grabbed... Congratulations you 2. Have a wonderful Honeymoon ❤️',
    sender: 'Tara B.',
  },
  {
    id: 'm_3',
    type: 'message',
    received_at: '2019-09-27T22:30:00.000',
    media: [],
    body:
      "We're keeping the party going and will be heading uptown via light rail. The train leaves at 12:10am, tickets are provided. Please join us!",
    sender: 'Brandon R.',
  },
  {
    id: 'r_5',
    type: 'reply',
    received_at: '2019-09-27T15:20:06.000',
    media: [],
    body: 'Understood!! Thanks for the info!! :)',
    sender: 'Robbie C.',
  },
  {
    id: 'm_2',
    type: 'message',
    received_at: '2019-09-27T15:15:06.000',
    media: [],
    body:
      "Just to clarify some questions, there is a single departure from the Marriott at 4pm. Ceremony begins 5pm sharp. There are several buses from the church to reception. Can't wait to see everyone soon!",
    sender: 'Brandon R.',
  },
  {
    id: 'r_4',
    type: 'reply',
    received_at: '2019-09-27T11:22:06.000',
    media: [],
    body:
      "Can I text back? I'm so excited for you guys!!! Can't wait to see you! :-)",
    sender: 'Frieda K.',
  },
  {
    id: 'r_3',
    type: 'reply',
    received_at: '2019-09-27T11:08:06.000',
    medias: [
      {
        id: 1,
        url: s3Config.urlPrefix + 'demo/cantwait.gif',
      },
    ],
    body: '',
    sender: 'Robbie C.',
  },
  {
    id: 'r_2',
    type: 'reply',
    received_at: '2019-09-27T10:48:06.000',
    media: [],
    body: "Yesss! I can't wait to see you all ❤️",
    sender: 'Sheridan R.',
  },
  {
    id: 'm_1',
    type: 'message',
    received_at: '2019-09-27T10:45:06.000',
    media: [],
    body:
      "Welcome to our wedding weekend! Thanks so much for coming - we'll be using text messages to share updates and reminders. - B&N",
    sender: 'Brandon R.',
  },
];

export const repliesByDay = replies.sort().reduce((acc, reply) => {
  const day = Moment(reply.received_at).format('MM/DD/YYYY');
  if (!acc[day]) acc[day] = [];
  acc[day].push(reply);
  return acc;
}, {});
