import { just, Maybe, nothing } from 'maybeasy';

export const fromBoolM = (bool: boolean): Maybe<true> => (bool ? just(true) : nothing());

export const filterMap = <A, B>(fn: (a: A) => Maybe<B>, arr: ReadonlyArray<A>): B[] =>
  arr.map(fn).reduce((bs: B[], mb) => mb.map((b) => bs.concat(b)).getOrElseValue(bs), []);
