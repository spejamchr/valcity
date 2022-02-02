// Return a random number between 0 and 1, approaching a normal distribution
// given a higher repetition number
export const normalizingRandom = (repetitions: number) => {
  const n = Math.floor(Math.abs(repetitions));
  return [...Array(n)].map(Math.random).reduce((a, n) => a + n, 0) / n;
};
