import * as React from 'react';
import Simulation from '../Simulation';

interface Props {}

const App: React.FC<Props> = () => <Simulation simKind="inelastic-collision" />;

export default App;
