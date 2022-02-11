import { find } from '@execonline-inc/collections';
import { action, computed, observable } from 'mobx';
import fullyAnnotatedObservable from '../../FullyAnnotatedObservable';
import { makeState, Options, State, Theme, ThemeName } from './Types';

class ThemeStore {
  public state: State;

  constructor() {
    this.state = makeState();
    fullyAnnotatedObservable<ThemeStore>(this, {
      state: observable,
      setTheme: action,
      revert: action,
      theme: computed,
      options: computed,
    });
  }

  setTheme = (name: ThemeName): void => {
    find((namedTheme) => namedTheme.name === name, this.options).do(
      ({ name, theme }) =>
        (this.state = { ...this.state, name, theme, previousName: this.state.name })
    );
  };

  revert = (): void => {
    this.setTheme(this.state.previousName);
  };

  get theme(): Theme {
    return this.state.theme;
  }

  get options(): Options {
    return this.state.options;
  }
}

export default ThemeStore;
