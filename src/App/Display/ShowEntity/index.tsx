import { find } from '@execonline-inc/collections';
import { just } from 'maybeasy';
import { observer } from 'mobx-react';
import * as React from 'react';
import { styled, theme } from '../../../stitches.config';
import ClickToShow from '../../ClickToShow';
import SimulationStore from '../../Simulation/Store';

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

const Label = styled('label', {
  display: 'block',
  paddingLeft: 5,
  paddingBottom: 5,
});

const fToStr = (f: number) => Math.trunc(f).toString();

const decimals = (f: number) => Math.min(Math.trunc(f), 999).toString();

const ShowEntity: React.FC<Props> = ({ entityId, store }) =>
  find((e) => e.id === entityId, store.entities)
    .map((entity) => (
      <ClickToShow title={entity.name.getOrElse(() => `Entity #${entity.id}`)}>
        <>
          {entity.fillStyle
            .map((fs) => <span style={{ color: fs.toString(), float: 'right' }}>⬤</span>)
            .getOrElseValue(<></>)}
          {entity.mass
            .map((mass) => (
              <Label>
                Mass:{' '}
                <NumField
                  aria-label="Mass (g)"
                  css={{ width: `${fToStr(mass * 1000).length}ch` }}
                  value={fToStr(mass * 1000)}
                  onChange={(e) => {
                    store.updateEntity(entity.id, {
                      mass: just(Number(e.target.value) / 1000),
                    });
                  }}
                />
                g
              </Label>
            ))
            .getOrElseValue(<></>)}
          {entity.position
            .map((position) => (
              <Label>
                Position: (
                <NumField
                  aria-label="Position-X (cm)"
                  css={{ width: `${fToStr(position.x * 100).length}ch` }}
                  value={fToStr(position.x * 100)}
                  onChange={(e) => {
                    store.updateEntity(entity.id, {
                      position: just(position.withX(Number(e.target.value) / 100)),
                    });
                  }}
                />
                cm ,{' '}
                <NumField
                  aria-label="Position-Y (cm)"
                  css={{ width: `${fToStr(position.y * 100).length}ch` }}
                  value={fToStr(position.y * 100)}
                  onChange={(e) => {
                    store.updateEntity(entity.id, {
                      position: just(position.withY(Number(e.target.value) / 100)),
                    });
                  }}
                />
                cm )
              </Label>
            ))
            .getOrElseValue(<></>)}
          {entity.velocity
            .map((velocity) => (
              <>
                <Label>
                  Velocity: (
                  <NumField
                    aria-label="Velocity-X (cm/s)"
                    css={{ width: `${fToStr(velocity.x * 100).length}ch` }}
                    value={fToStr(velocity.x * 100)}
                    onChange={(e) => {
                      store.updateEntity(entity.id, {
                        velocity: just(velocity.withX(Number(e.target.value) / 100)),
                      });
                    }}
                  />
                  cm/s ,{' '}
                  <NumField
                    aria-label="Velocity-Y (cm/s)"
                    css={{ width: `${fToStr(velocity.y * 100).length}ch` }}
                    value={fToStr(velocity.y * 100)}
                    onChange={(e) => {
                      store.updateEntity(entity.id, {
                        velocity: just(velocity.withY(Number(e.target.value) / 100)),
                      });
                    }}
                  />
                  cm/s )
                </Label>
                <Label>
                  Speed:{' '}
                  <NumField
                    aria-label="Speed (cm/s)"
                    css={{ width: `${fToStr(velocity.y * 100).length}ch` }}
                    value={fToStr(velocity.magnitude * 100)}
                    onChange={(e) => {
                      store.updateEntity(entity.id, {
                        velocity: just(velocity.withMagnitude(Number(e.target.value) / 100)),
                      });
                    }}
                  />
                  cm/s
                </Label>
              </>
            ))
            .getOrElseValue(<></>)}
          {entity.dragCoefficient
            .map((Cd) => (
              <Label>
                Drag Coefficient: <NumSpan>0.</NumSpan>
                <NumField
                  aria-label="Drag Coefficient"
                  css={{ width: `${fToStr(Cd * 1000).length}ch` }}
                  value={fToStr(Cd * 1000)}
                  onChange={(e) => {
                    store.updateEntity(entity.id, {
                      dragCoefficient: just(Number(e.target.value.slice(0, 3)) / 1000),
                    });
                  }}
                />
              </Label>
            ))
            .getOrElseValue(<></>)}
          {entity.restitutionCoefficient
            .map((CoR) => (
              <Label>
                Coefficient of Restitution: <NumSpan>0.</NumSpan>
                <NumField
                  aria-label="Coefficient of Restitution"
                  css={{ width: `${decimals(CoR * 1000).length}ch` }}
                  value={decimals(CoR * 1000)}
                  min={0}
                  max={999}
                  onChange={(e) => {
                    store.updateEntity(entity.id, {
                      restitutionCoefficient: just(Number(e.target.value.slice(0, 3)) / 1000),
                    });
                  }}
                />
              </Label>
            ))
            .getOrElseValue(<></>)}
        </>
      </ClickToShow>
    ))
    .getOrElse(() => <p>Didn't find an Entity</p>);

export default observer(ShowEntity);
