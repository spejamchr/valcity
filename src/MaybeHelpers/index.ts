import { just, Maybe, nothing } from 'maybeasy';

export const fromBoolM = (bool: boolean): Maybe<true> => (bool ? just(true) : nothing());
