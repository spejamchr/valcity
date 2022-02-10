export default class Vector {
  constructor(readonly x: number, readonly y: number) {}

  magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);

  normalized = (): Vector => this.divideBy(this.magnitude);

  plus = (other: Vector): Vector => new Vector(this.x + other.x, this.y + other.y);
  minus = (other: Vector): Vector => new Vector(this.x - other.x, this.y - other.y);
  dot = (other: Vector): number => this.x * other.x + this.y * other.y;

  reflection = (normal: Vector): Vector =>
    this.minus(normal.times((2 * this.dot(normal)) / normal.magnitude ** 2));

  times = (scalar: number): Vector => new Vector(this.x * scalar, this.y * scalar);
  divideBy = (scalar: number): Vector => new Vector(this.x / scalar, this.y / scalar);
  exp = (scalar: number): Vector =>
    this.magnitude === 0 ? this : this.withMagnitude(this.magnitude ** scalar);

  withX = (x: number): Vector => new Vector(x, this.y);
  withY = (y: number): Vector => new Vector(this.x, y);
  withMagnitude = (scalar: number): Vector => this.normalized().times(scalar === 0 ? 0.001 : scalar);
}
