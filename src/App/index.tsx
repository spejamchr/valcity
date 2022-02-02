import * as React from 'react';
import Info from './Info';
import Simulation from './Simulation';

interface Props {}

const App: React.FC<Props> = () => (
  <>
    <Simulation simKind="inelastic-collision" />
    <Info>
      <p>Here's a paragraph</p>
    </Info>
  </>
);

export default App;
