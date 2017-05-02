import xs, { Stream } from 'xstream';

import { State } from '@app/model/state';
import { Action, AppActions } from '@app/intent';

export type Reducer = (state: State) => State

export const tick = (state: State) => ({
  initialValue: state.initialValue,
  isRunning: state.isRunning,
  value: state.value - 1,
});

export const reset = (state: State) => ({
  initialValue: state.initialValue,
  isRunning: false,
  value: state.initialValue
});

export const start = (state: State) => ({
  initialValue: state.initialValue,
  isRunning: true,
  value: state.value
});

export const stop = (state: State) => ({
  initialValue: state.initialValue,
  isRunning: false,
  value: state.value
});

export const changeTime = (action: Action) =>
  (state: State) => ({
    initialValue: action.data,
    isRunning: false,
    value: action.data
  });

export function createReducer$(
  interval$: Stream<number>,
  appActions: AppActions): Stream<Reducer> {

  return xs.merge(
    interval$.mapTo(tick),
    appActions.reset$.mapTo(reset),
    appActions.start$.mapTo(start),
    appActions.stop$.mapTo(stop),
    appActions.changeTime$.map(action => changeTime(action)),
  );
}
