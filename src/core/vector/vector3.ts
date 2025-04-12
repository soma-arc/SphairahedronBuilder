export default class Vector3 {
    x: number;
    y: number;
    z: number;

    static EPSILON: number = 0.000001;

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @param {Vector3} v
     * @returns {Vector3}
     */
    add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    /**
     * @param {Vector3} v
     * @returns {Vector3}
     */
    sub(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    /**
     * @param {Vector3} v
     * @returns {Vector3}
     */
    prod(v: Vector3): Vector3 {
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    /**
     * @param {Vector3} v
     * @returns {Vector3}
     */
    div(v: Vector3): Vector3 {
        return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    /**
     * @param {number} k
     * @returns {Vector3}
     */
    scale(k: number): Vector3 {
        return new Vector3(this.x * k, this.y * k, this.z * k);
    }

    /**
     * @returns {number}
     */
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * @returns {number}
     */
    squaredLength(): number {
        return (this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * @returns {Vector3}
     */
    normalize(): Vector3 {
        return this.scale(1.0 / this.length());
    }

    /**
     * @param {Vector3} v
     * @returns {boolean}
     */
    eq(v: Vector3): boolean {
        return (
            Math.abs(this.x - v.x) < Vector3.EPSILON &&
            Math.abs(this.y - v.y) < Vector3.EPSILON &&
            Math.abs(this.z - v.z) < Vector3.EPSILON
        );
    }

    /**
     * @param {Vector3} v
     * @returns {Vector3}
     */
    static normalize(v: Vector3): Vector3 {
        return v.normalize();
    }

    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @returns {number}
     */
    static dot(v1: Vector3, v2: Vector3): number {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z);
    }

    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @returns {Vector3}
     */
    static cross(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }

    /**
     * @param {Vector3} v1
     * @param {Vector3} v2
     * @returns {number}
     */
    static distance(v1: Vector3, v2: Vector3): number {
        const l = v1.sub(v2);
        return Math.sqrt(l.x * l.x + l.y * l.y + l.z * l.z);
    }

    /**
     * @param {number} radians
     * @returns {Vector3}
     */
    rotateX(radians: number): Vector3 {
        const cosRad = Math.cos(radians);
        const sinRad = Math.sin(radians);
        return new Vector3(this.x, cosRad * this.y + -sinRad * this.z, sinRad * this.y + cosRad * this.z);
    }

    /**
     * @param {number} radians
     * @returns {Vector3}
     */
    rotateY(radians: number): Vector3 {
        const cosRad = Math.cos(radians);
        const sinRad = Math.sin(radians);
        return new Vector3(cosRad * this.x + sinRad * this.z, this.y, -sinRad * this.x + cosRad * this.z);
    }

    /**
     * @param {number} radians
     * @returns {Vector3}
     */
    rotateZ(radians: number): Vector3 {
        const cosRad = Math.cos(radians);
        const sinRad = Math.sin(radians);
        return new Vector3(cosRad * this.x - sinRad * this.y, sinRad * this.x + cosRad * this.y, this.z);
    }
}
