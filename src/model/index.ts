import xs, { Stream } from 'xstream';

import { Action, ActionType, AppActions } from '@app/intent';
import { State } from '@app/model/state';
import { Reducer, createReducer$ } from '@app/model/reducers';

function createTimer(start$: Stream<Action>, stoppers$: Stream<Action>) {
  const createInterruptibleInterval =
    () => xs.periodic(1000).endWhen(stoppers$);

  return start$.map(createInterruptibleInterval).flatten();
}

const initialState = {
  value: 10,
  initialValue: 10,
  isRunning: false,
};

export default function model(appAction$: AppActions, initialValue: number): Stream<State> {
  const timerFinishedProxy$ = xs.create() as Stream<Action>;

  const { start$, stop$, reset$, changeTime$ } = appAction$;

  const stoppers$ = xs.merge(stop$, reset$, timerFinishedProxy$);
  const timerTick$ = createTimer(start$, stoppers$);

  const reducer$ = createReducer$(timerTick$, appAction$);
  const state$ =
    reducer$
      .fold((state: State, op: Reducer) => op(state), initialState)
      .remember()

  const timerFinished$ = state$
    .filter(state => state.value === 0)
    .map(() => ({ type: ActionType.Stop }));

  // imitate the timerFinished$ stream to stop the interval
  timerFinishedProxy$.imitate(timerFinished$)

  return state$;
}