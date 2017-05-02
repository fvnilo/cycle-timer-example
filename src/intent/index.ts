import xs, { Stream } from 'xstream';

import { DOMSource } from '@cycle/dom';

export enum ActionType {
  Start,
  Stop,
  Reset,
  ChangeTime
};

export type Action = {
  type: ActionType,
  data?: any
};

export type AppActions = {
  start$: Stream<Action>,
  stop$: Stream<Action>,
  reset$: Stream<Action>,
  changeTime$: Stream<Action>,
};

function mapClickEvents(domSource: DOMSource, selector: string, actionType: ActionType): Stream<Action> {
  return domSource.select(selector).events('click').map(() => ({ type: actionType }));
}

function mapInputEvents(domSource: DOMSource, selector: string, actionType: ActionType): Stream<Action> {
  return domSource.select(selector).events('input').map((event) => ({
    type: actionType,
    data: parseInt((event.target as HTMLInputElement).value || '0', 10)
  }))
}

export default function intent(domSource: DOMSource): AppActions {
  const start$ = mapClickEvents(domSource, '.start', ActionType.Start);
  const stop$ = mapClickEvents(domSource, '.stop', ActionType.Stop);
  const reset$ = mapClickEvents(domSource, '.reset', ActionType.Reset);
  const changeTime$ = mapInputEvents(domSource, '.countdown-value', ActionType.ChangeTime);

  return { start$, stop$, reset$, changeTime$ };
}