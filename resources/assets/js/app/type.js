// @flow
import type { Map } from 'immutable';
import type Moment from 'moment';
import { string } from 'prop-types';

export type ID = string | number;

type EventLocation = {
  city?: string,
  state?: string,
  country?: string,
};

export type DashboardData = {
  counts: {
    messages: number,
    guests: number,
    groups: number,
  },
};

export type Event = {
  id?: ID,
  name?: string,
  location: EventLocation,
  timezone?: string,
  startTime?: Moment,
  endTime?: Moment,
  isStreamPublic: boolean,
  payment?: {
    activated: boolean,
    totalCredits: number,
    spentCredits: number,
    remainingCredits: number,
  },
};

export type Message = {
  id?: ID,
  contents?: string,
};

export type Guest = {
  id?: ID,
  first_name?: string,
  last_name?: string,
  phone?: string,
  groups?: Array<Group>,
};

export type Group = {
  id?: ID,
  name?: string,
  description?: string,
  guests?: Array<Guest>,
};
export type IndividualText = {
  id?:ID,
  name?:string,
  description? :string,
 
}

export type TMGState = {
  Event: Map<string, mixed>,
  Guest: Map<string, mixed>,
};
