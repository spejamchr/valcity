export interface Hidden {
  kind: 'hidden';
}

export interface Showing {
  kind: 'showing';
}

export type State = Hidden | Showing;

export const hidden = (): Hidden => ({ kind: 'hidden' });

export const showing = (): Showing => ({ kind: 'showing' });
