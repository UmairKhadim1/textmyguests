import React from 'react';
import OnboardingTask from './OnboardingTask';
import RocketIcon from '../../components/uielements/rocketIcon';
import Planner from '../Planner/Planner';

type Props = {
  messageCount: number,
  guestCount: number,
  groupCount: number,
  eventIsActivated: boolean,
};

const OnboardingTaskList: React.FC = (props: Props) => (
  <div>
    <OnboardingTask
      completed={true}
      label="Configure event settings"
      icon={<i className="ion-gear-b" />}
      link="/dashboard/event-settings"
    />
    <OnboardingTask
      completed={props.messageCount}
      label="Create a Message"
      icon={<i className="ion-android-textsms" />}
      link="/dashboard/messages"
    />
    <OnboardingTask
      completed={props.guestCount > 1}
      label="Add some Guests"
      icon={<i className="ion-person" />}
      link="/dashboard/guests"
    />
    <OnboardingTask
      completed={props.groupCount > 2}
      label="Create a Group"
      icon={<i className="ion-ios-people" />}
      link="/dashboard/groups"
    />
    <Planner />
    <OnboardingTask
      completed={props.eventIsActivated}
      label="Activate Event"
      icon={<RocketIcon size={20} color="#fff" />}
      link="/dashboard/activate"
    />
  </div>
);

export default OnboardingTaskList;
