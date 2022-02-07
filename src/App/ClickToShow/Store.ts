import { action, observable } from 'mobx';
import { assertNever } from '../../AssertNever';
import fullyAnnotatedObservable from '../../FullyAnnotatedObservable';
import { hidden, showing, State } from './Types';

class ShowStore {
  public state: State;
  constructor() {
    this.state = hidden();
    fullyAnnotatedObservable<ShowStore>(this, {
      state: observable,
      toggle: action,
    });
  }

  toggle(): void {
    switch (this.state.kind) {
      case 'hidden':
        this.state = showing();
        break;
      case 'showing':
        this.state = hidden();
        break;
      default:
        assertNever(this.state);
    }
  }
}

export default ShowStore;
