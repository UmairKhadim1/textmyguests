// @flow
import { Map } from 'immutable';
export type ID = number | string;

export type GlobalState = {
  Event: Map<string, any>,
  Message: Map<string, any>,
  IndividualText:Map<string, any>,
  Guest: Map<string, any>,
  Group: Map<string, any>,
  Loading: Map<string, any>,
  Invoices: Map<String, any>,
  Test: Map<String, any>,
};

export type Event = {
  id?: ID,
  contents?: string,
};
