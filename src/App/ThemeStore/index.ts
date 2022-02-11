import { find } from '@execonline-inc/collections';
import { action, computed, observable } from 'mobx';
import fullyAnnotatedObservable from '../../FullyAnnotatedObservable';
import { makeState, State, Theme, ThemeName } from './Types';

class ThemeStore {
  public state: State;

  constructor() {
    this.state = makeState();
    fullyAnnotatedObservable<ThemeStore>(this, {
      state: observable,
      setTheme: action,
      theme: computed,
    });
  }

  setTheme = (name: ThemeName): void => {
    find((namedTheme) => namedTheme.name === name, this.state.options).do(
      ({ name, theme }) => (this.state = { ...this.state, name, theme })
    );
  };

  get theme(): Theme {
    return this.state.theme;
  }
}

export default ThemeStore;
