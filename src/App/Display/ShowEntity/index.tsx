import { find } from '@execonline-inc/collections';
import { just, nothing } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { styled, theme } from '../../../stitches.config';
import Vector from '../../../Vector';
import ClickToShow from '../../ClickToShow';
import SimulationStore from '../../Simulation/Store';
import { makeRenderComponent } from './RenderComponent';

interface Props {
  entityId: number;
  store: SimulationStore;
}

const NumField = styled('input', {
  fontFamily: 'monospace',
  color: theme.colors.base05,
  backgroundColor: theme.colors.base02,
  border: 'none',
});

const NumSpan = styled('span', {
  fontFamily: 'monospace',
});

const fToStr = (f: number) => Math.trunc(f).toString();

const decimals = (f: number) => Math.min(Math.trunc(f), 999).toString();

const ShowEntity: React.FC<Props> = ({ entityId, store }) =>
  find((e) => e.id === entityId, store.entities)
    .map((entity) => ({ entity, RenderComponent: makeRenderComponent(store, entity) }))
    .map(({ entity, RenderComponent }) => (
      <ClickToShow title={entity.name.getOrElse(() => `Entity #${entity.id}`)}>
        <>
          {entity.fillStyle
            .map((fs) => <span style={{ color: fs.toString(), float: 'right' }}>⬤</span>)
            .getOrElseValue(<></>)}
          <RenderComponent
            title="Name"
            form={(fn) =>
              fn('name', nothing(), (name) => (
                <NumField
                  aria-label="Name"
                  css={{ width: `${name.length}ch` }}
                  value={name}
                  onChange={(e) => store.updateEntity(entity.id, { name: just(e.target.value) })}
                />
              ))
            }
          />

          <RenderComponent
            title="Mass"
            form={(fn) =>
              fn('mass', just(1), (mass) => (
                <>
                  <NumField
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
            form={(fn) =>
              fn('position', just(new Vector(0, 1)), (position) => (
                <>
                  (
                  <NumField
                    aria-label="Position-X (cm)"
                    css={{ width: `${fToStr(position.x * 100).length}ch` }}
                    value={fToStr(position.x * 100)}
                    onChange={(e) =>
                      store.updateEntity(entity.id, {
                        position: just(position.withX(Number(e.target.value) / 100)),
                      })
                    }
                  />
                  cm,{' '}
                  <NumField
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
                </>
              ))
            }
          />

          <RenderComponent
            title="Velocity"
            form={(fn) =>
              fn('velocity', just(new Vector(0.001, 0.001)), (velocity) => (
                <>
                  (
                  <NumField
                    aria-label="Velocity-X (cm/s)"
                    css={{ width: `${fToStr(velocity.x * 100).length}ch` }}
                    value={fToStr(velocity.x * 100)}
                    onChange={(e) =>
                      store.updateEntity(entity.id, {
                        velocity: just(velocity.withX(Number(e.target.value) / 100)),
                      })
                    }
                  />
                  cm/s,{' '}
                  <NumField
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
                </>
              ))
            }
          />

          <RenderComponent
            title="Speed"
            form={(fn) =>
              fn('velocity', just(new Vector(0.001, 0.001)), (velocity) => (
                <>
                  <NumField
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
            form={(fn) =>
              fn('dragCoefficient', just(0), (Cd) => (
                <>
                  <NumSpan>0.</NumSpan>
                  <NumField
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
            form={(fn) =>
              fn('restitutionCoefficient', just(0.999), (CoR) => (
                <>
                  <NumSpan>0.</NumSpan>
                  <NumField
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
        </>
      </ClickToShow>
    ))
    .getOrElse(() => <p>Didn't find an Entity</p>);

export default observer(ShowEntity);
