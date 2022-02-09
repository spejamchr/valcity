import { just, Maybe, nothing } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { styled } from '../../../stitches.config';
import SimulationStore from '../../Simulation/Store';
import { Components, Entity } from '../../Simulation/Types';
import UpdateButton from './UpdateEntity';

const ComponentRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  minWidth: 250,
  padding: 1,
});

const Label = styled('label', {
  display: 'block',
});

interface Props {
  store: SimulationStore;
  entity: Entity;
  title: string;
  form: (
    fn: <T extends keyof Components>(
      key: T,
      defaultValue: Maybe<Components[T]>,
      form: (value: Components[T]) => React.ReactElement
    ) => React.ReactElement
  ) => React.ReactElement;
}

const RenderComponent: React.FC<Props> = ({ store, entity, title, form }) =>
  form((key, defaultValue, formFn) => {
    const maybeValue: Maybe<Components[typeof key]> = entity[key] as Maybe<Components[typeof key]>;
    return (
      <ComponentRow>
        <>
          {defaultValue
            .map((value) =>
              maybeValue
                .map(() => (
                  <UpdateButton
                    type="remove"
                    update={{ [key]: nothing() }}
                    entityId={entity.id}
                    store={store}
                  />
                ))
                .getOrElse(() => (
                  <UpdateButton
                    type="add"
                    update={{ [key]: just(value) }}
                    entityId={entity.id}
                    store={store}
                  />
                ))
            )
            .getOrElseValue(<></>)}
          <Label>
            {title}: {maybeValue.map(formFn).getOrElseValue(<></>)}
          </Label>
        </>
      </ComponentRow>
    );
  });

export default observer(RenderComponent);
