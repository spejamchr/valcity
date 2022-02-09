import { find } from '@execonline-inc/collections';
import { just, nothing } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Control } from '..';
import { styled, theme } from '../../../stitches.config';
import Vector from '../../../Vector';
import ClickToShow from '../../ClickToShow';
import SimulationStore from '../../Simulation/Store';
import FillStylePicker from './FillStylePicker';
import RenderComponent from './RenderComponent';

interface Props {
  entityId: number;
  store: SimulationStore;
}

const Input = styled('input', {
  fontFamily: 'monospace',
  fontSize: 15,
  color: theme.colors.base05,
  backgroundColor: theme.colors.base02,
  border: 'none',
  minWidth: '1ch',
});

const NumSpan = styled('span', {
  fontFamily: 'monospace',
  fontSize: 15,
});

const fToStr = (f: number) => Math.trunc(f).toString();

const decimals = (f: number) => Math.min(Math.trunc(f), 999).toString();

const ShowEntity: React.FC<Props> = ({ entityId, store }) =>
  find((e) => e.id === entityId, store.entities)
    .map((entity) => (
      <ClickToShow title={entity.name.getOrElse(() => `Entity #${entity.id}`)}>
        <>
          {entity.fillStyle
            .map((fs) => <FillStylePicker fillStyle={fs} store={store} entityId={entity.id} />)
            .getOrElseValue(<></>)}

          <RenderComponent
            title="Name"
            entity={entity}
            store={store}
            form={(fn) =>
              fn('name', nothing(), (name) => (
                <Input
                  id="nameInput"
                  aria-label="Name"
                  css={{ width: `${name.length}ch` }}
                  value={name}
                  onChange={(e) => store.updateEntity(entity.id, { name: just(e.target.value) })}
                />
              ))
            }
          />

          <RenderComponent
            title="Trace Path"
            entity={entity}
            store={store}
            form={(fn) => fn('trackPosition', just(null), () => <>Yes</>)}
          />

          <RenderComponent
            title="Mass"
            entity={entity}
            store={store}
            form={(fn) =>
              fn('mass', just(0.6), (mass) => (
                <>
                  <Input
                    aria-label="Mass (g)"
                    css={{ width: `${fToStr(mass * 1000).length}ch` }}
                    value={fToStr(mass * 1000)}
                    onChange={(e) =>
                      store.updateEntity(entity.id, { mass: just(Number(e.target.value) / 1000) })
                    }
                  />
                  g
                </>
              ))
            }
          />

          <RenderComponent
            title="Position"
            entity={entity}
            store={store}
            form={(fn) =>
              fn('position', just(new Vector(0, 0.121)), (position) => (
                <>
                  (
                  <label>
                    x:{' '}
                    <Input
                      aria-label="Position-X (cm)"
                      css={{ width: `${fToStr(position.x * 100).length}ch` }}
                      value={fToStr(position.x * 100)}
                      onChange={(e) =>
                        store.updateEntity(entity.id, {
                          position: just(position.withX(Number(e.target.value) / 100)),
                        })
                      }
                    />
                    cm,
                  </label>{' '}
                  <label>
                    y:{' '}
                    <Input
                      aria-label="Position-Y (cm)"
                      css={{ width: `${fToStr(position.y * 100).length}ch` }}
                      value={fToStr(position.y * 100)}
                      onChange={(e) =>
                        store.updateEntity(entity.id, {
                          position: just(position.withY(Number(e.target.value) / 100)),
                        })
                      }
                    />
                    cm)
                  </label>
                </>
              ))
            }
          />

          <RenderComponent
            title="Velocity"
            entity={entity}
            store={store}
            form={(fn) =>
              fn('velocity', just(new Vector(15, 15)), (velocity) => (
                <>
                  (
                  <label>
                    x:{' '}
                    <Input
                      aria-label="Velocity-X (cm/s)"
                      css={{ width: `${fToStr(velocity.x * 100).length}ch` }}
                      value={fToStr(velocity.x * 100)}
                      onChange={(e) =>
                        store.updateEntity(entity.id, {
                          velocity: just(velocity.withX(Number(e.target.value) / 100)),
                        })
                      }
                    />
                    cm/s,
                  </label>{' '}
                  <label>
                    y:{' '}
                    <Input
                      aria-label="Velocity-Y (cm/s)"
                      css={{ width: `${fToStr(velocity.y * 100).length}ch` }}
                      value={fToStr(velocity.y * 100)}
                      onChange={(e) =>
                        store.updateEntity(entity.id, {
                          velocity: just(velocity.withY(Number(e.target.value) / 100)),
                        })
                      }
                    />
                    cm/s)
                  </label>
                </>
              ))
            }
          />

          <RenderComponent
            title="Speed"
            entity={entity}
            store={store}
            form={(fn) =>
              fn('velocity', just(new Vector(15, 15)), (velocity) => (
                <>
                  <Input
                    aria-label="Speed (cm/s)"
                    css={{ width: `${fToStr(velocity.magnitude * 100).length}ch` }}
                    value={fToStr(velocity.magnitude * 100)}
                    onChange={(e) =>
                      store.updateEntity(entity.id, {
                        velocity: just(velocity.withMagnitude(Number(e.target.value) / 100)),
                      })
                    }
                  />
                  cm/s
                </>
              ))
            }
          />

          <RenderComponent
            title="Drag Coefficient"
            entity={entity}
            store={store}
            form={(fn) =>
              fn('dragCoefficient', just(0.47), (Cd) => (
                <>
                  <NumSpan>0.</NumSpan>
                  <Input
                    aria-label="Drag Coefficient"
                    css={{ width: `${fToStr(Cd * 1000).length}ch` }}
                    value={fToStr(Cd * 1000)}
                    onChange={(e) =>
                      store.updateEntity(entity.id, {
                        dragCoefficient: just(Number(e.target.value.slice(0, 3)) / 1000),
                      })
                    }
                  />
                </>
              ))
            }
          />

          <RenderComponent
            title="Coefficient of Restitution"
            entity={entity}
            store={store}
            form={(fn) =>
              fn('restitutionCoefficient', just(0.77), (CoR) => (
                <>
                  <NumSpan>0.</NumSpan>
                  <Input
                    aria-label="Coefficient of Restitution"
                    css={{ width: `${decimals(CoR * 1000).length}ch` }}
                    value={decimals(CoR * 1000)}
                    min={0}
                    max={999}
                    onChange={(e) =>
                      store.updateEntity(entity.id, {
                        restitutionCoefficient: just(Number(e.target.value.slice(0, 3)) / 1000),
                      })
                    }
                  />
                </>
              ))
            }
          />

          <Control onClick={() => store.filterEntities((e) => e.id !== entity.id)}>Remove</Control>
        </>
      </ClickToShow>
    ))
    .getOrElse(() => <p>Didn't find an Entity</p>);

export default observer(ShowEntity);
