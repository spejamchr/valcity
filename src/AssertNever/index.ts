export const assertNever = (thing: never): never => {
  throw new Error(`Expected thing to be never, but got: ${JSON.stringify(thing)}`);
};
