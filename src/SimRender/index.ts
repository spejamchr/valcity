import { just } from 'maybeasy';
import { System } from '../App/Simulation/Types';

const backgroundRenderSystem: System = (store) => {
  store.contextVars.canvasAndContext.do(({ canvas, context }) => {
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#333333';
    context.fill();
  });
};

const entityRenderSystem: System = (store) => {
  just({})
    .assign('scale', store.scale)
    .assign('minViewX', store.minViewX)
    .do(({ scale, minViewX }) =>
      store.entities.forEach((entity) =>
        just({})
          .assign('position', entity.position)
          .assign('shape', entity.shape)
          .assign('fillStyle', entity.fillStyle)
          .assign('canvasAndContext', store.contextVars.canvasAndContext)
          .do(({ position, shape, fillStyle, canvasAndContext: { canvas, context } }) => {
            const xPix = (position.x - minViewX) * scale;
            const yPix = canvas.height - (position.y - store.minViewY) * scale;

            context.beginPath();
            context.arc(xPix, yPix, shape.radius * scale, 0, 2 * Math.PI);
            context.fillStyle = fillStyle;
            context.fill();
          })
      )
    );
};

const lineRenderSystem: System = (store) => {
  just({})
    .assign('scale', store.scale)
    .assign('cc', store.contextVars.canvasAndContext)
    .assign('minViewX', store.minViewX)
    .assign('maxViewX', store.maxViewX)
    .do(({ scale, cc: { canvas, context }, minViewX, maxViewX }) => {
      const buffer = 20;

      const xLeft = Math.round(minViewX) - buffer;
      const xRight = Math.round(maxViewX) + buffer;
      for (let xi = xLeft; xi <= xRight; xi++) {
        const xPix = (xi - minViewX) * scale;
        const pxWidth = calcLineWidth(xi) * scale;
        context.fillStyle = '#000000';
        context.fillRect(xPix - pxWidth / 2, 0, pxWidth, canvas.height);
      }

      const xTop = Math.round(canvas.height / scale) + buffer;
      for (let yi = 1; yi <= xTop; yi++) {
        const yPix = canvas.height - yi * scale;
        const pxHeight = calcLineWidth(yi) * scale;
        context.fillStyle = '#000000';
        context.fillRect(0, yPix - pxHeight / 2, canvas.width, pxHeight);
      }
    });
};

const calcLineWidth = (i: number): number => {
  if (i === 0) return 0.005 * 3 ** 3;

  let eTry = 1;
  while (i % 5 ** eTry === 0) eTry++;
  return 0.005 * 3 ** (eTry - 1);
};

export const renderSystem: System = (store) => {
  backgroundRenderSystem(store);
  lineRenderSystem(store);
  entityRenderSystem(store);
};
