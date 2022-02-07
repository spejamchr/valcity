import {AnnotationsMap, makeObservable} from 'mobx';

const fullyAnnotatedObservable = <T extends object>(
  target: T,
  annotations: Required<AnnotationsMap<T, never>>
) => makeObservable(target, annotations);

export default fullyAnnotatedObservable;
