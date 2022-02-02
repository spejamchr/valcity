import { fromNullable, Maybe } from 'maybeasy';

export interface CanvasAndContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

const scaleCanvasDimension = (canvas: HTMLCanvasElement, property: 'height' | 'width'): void => {
  const size = getComputedStyle(canvas).getPropertyValue(property).slice(0, -2);

  canvas[property] = Number(size) * window.devicePixelRatio;
  canvas.style[property] = `${size}px`;
};

const setCanvasScaling = (canvas: HTMLCanvasElement): void => {
  scaleCanvasDimension(canvas, 'height');
  scaleCanvasDimension(canvas, 'width');
};

export const canvasAndContextFromRef = (
  ref: React.RefObject<HTMLCanvasElement>
): Maybe<CanvasAndContext> =>
  fromNullable(ref.current)
    .do(setCanvasScaling)
    .map((canvas) => ({ canvas }))
    .assign('context', ({ canvas }) => fromNullable(canvas.getContext('2d')));
