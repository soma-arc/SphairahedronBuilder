export default class Vector2 {
    x: number;
    y: number;
    private static readonly EPSILON: number = 0.00001;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    prod(v: Vector2): Vector2 {
        return new Vector2(this.x * v.x, this.y * v.y);
    }

    div(v: Vector2): Vector2 {
        return new Vector2(this.x / v.x, this.y / v.y);
    }

    scale(k: number): Vector2 {
        return new Vector2(this.x * k, this.y * k);
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSq(): number {
        return (this.x * this.x + this.y * this.y);
    }

    normalize(): Vector2 {
        return this.scale(1.0 / this.length());
    }

    eq(v: Vector2): boolean {
        return Math.abs(this.x - v.x) <= Vector2.EPSILON
            && Math.abs(this.y - v.y) <= Vector2.EPSILON;
    }

    cloneDeeply(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    static normalize(v: Vector2): Vector2 {
        return v.normalize();
    }

    static dot(v1: Vector2, v2: Vector2): number {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static distance(v1: Vector2, v2: Vector2): number {
        const l = v1.sub(v2);
        return Math.sqrt(l.x * l.x + l.y * l.y);
    }
}
