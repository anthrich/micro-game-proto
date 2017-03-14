export default class Vector2 {

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static sum(vectorA: Vector2, vectorB: Vector2) : Vector2 {
    return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
  }

  static subtract(vectorA: Vector2, vectorB: Vector2) : Vector2 {
    return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
  }

  static scale(scalar: number, vector: Vector2) : Vector2 {
    return new Vector2(vector.x * scalar, vector.y * scalar);
  }

  static distance(vectorA: Vector2, vectorB: Vector2) : number {
    return Vector2.subtract(vectorA, vectorB).getLength();
  }

  static normalise(vector: Vector2) : Vector2 {
    let length = vector.getLength();
    let newVectorX = 0, newVectorY = 0;
    if(length && vector.x) newVectorX = vector.x / length;
    if(length && vector.y) newVectorY = vector.y / length;
    return new Vector2(newVectorX, newVectorY);
  }

  getLength() : number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}
