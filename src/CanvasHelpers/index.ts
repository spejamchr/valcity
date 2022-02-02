import { fromNullable, Maybe } from 'maybeasy';

export interface CanvasAndContext {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

const scaleCanvasDimension = (canvas: HTMLCanvasElement, property: 'Height' | 'Width'): void => {
  const size: number = window[`inner${property}`];
  const lower = property.toLowerCase() as Lowercase<typeof property>;

  canvas[lower] = Number(size) * window.devicePixelRatio;
  canvas.style[lower] = `${size}px`;
};

export const setCanvasScaling = (canvas: HTMLCanvasElement): void => {
  scaleCanvasDimension(canvas, 'Height');
  scaleCanvasDimension(canvas, 'Width');
};

export const canvasAndContextFromRef = (
  ref: React.RefObject<HTMLCanvasElement>
): Maybe<CanvasAndContext> =>
  fromNullable(ref.current)
    .do(setCanvasScaling)
    .map((canvas) => ({ canvas }))
    .assign('context', ({ canvas }) => fromNullable(canvas.getContext('2d')));
