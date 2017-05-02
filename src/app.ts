import xs from 'xstream';

import { DOMSource } from '@cycle/dom';

import intent from '@app/intent';
import model from '@app/model';
import view from '@app/view';

export type Sources = {
  DOM: DOMSource
};

export function App(sources: Sources) {
  const initialValue = 10;

  const actions = intent(sources.DOM);
  const state$ = model(actions, initialValue);
  const vtree$ = view(state$);

  const sinks = {
    DOM: vtree$
  }

  return sinks
}
