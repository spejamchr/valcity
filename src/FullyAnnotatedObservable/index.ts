import { AnnotationsMap, makeObservable } from 'mobx';
import SimulationStore from '../App/Simulation/Store';

const fullyAnnotatedObservable = <T extends object>(
  target: T,
  annotations: Required<AnnotationsMap<SimulationStore, never>>
) => makeObservable(target, annotations);

export default fullyAnnotatedObservable;
