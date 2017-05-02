import { Stream } from 'xstream';

import { div, button, h1, input, hr, VNode } from '@cycle/dom';

import { State } from '@app/model/state';

export default function view(state$: Stream<State>): Stream<VNode> {
  return state$.map(state =>
    div([
      h1('Countdown value'),
      input('.countdown-value', { attrs: { type: 'number', value: state.initialValue, disabled: state.isRunning } }),
      hr(),
      h1(`Remaining time: ${state.value}`),
      button('.start', { attrs: { disabled: state.isRunning } }, 'Start'),
      button('.stop', { attrs: { disabled: !state.isRunning } }, 'Stop'),
      button('.reset', 'Reset')
    ])
  )
}