import { styled, theme } from '../../../stitches.config';
import SimulationStore from '../../Simulation/Store';
import { Components, Entity } from '../../Simulation/Types';

interface UpdateButtonProps {
  update: Partial<Pick<Entity, keyof Components>>;
  type: 'add' | 'remove';
}

const Button = styled('button', {
  marginX: 5,
  marginY: 1,
  backgroundColor: theme.colors.base02,
  border: 'none',
  color: theme.colors.base05,
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  cursor: 'pointer',
});

const makeUpdateButton = (
  entityId: number,
  store: SimulationStore
): React.FC<UpdateButtonProps> => ({ update, type }) => (
  <Button
    css={{ color: type === 'add' ? theme.colors.base0B : theme.colors.base08 }}
    onClick={() => store.updateEntity(entityId, update)}
  >
    {type === 'add' ? '✚' : '✖'}
  </Button>
);

export default makeUpdateButton;
