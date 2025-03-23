import Vector3 from './vector/vector3';
import Vec2 from './vector/vector2';
import Sphere from './sphere';

interface LineEquation {
    x: number;
    y: number;
    z: number;
}

export default class Plane {
    p1: Vector3;
    p2: Vector3;
    p3: Vector3;
    normal: Vector3;

    /**
     * @param {Vector3} p1
     * @param {Vector3} p2
     * @param {Vector3} p3
     * @param {Vector3} normal
     */
    constructor(p1: Vector3, p2: Vector3, p3: Vector3, normal: Vector3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.normal = normal;
    }

    toJson(): { normal: number[]; p1: number[]; p2: number[]; p3: number[] } {
        return {
            'normal': [this.normal.x, this.normal.y, this.normal.z],
            'p1': [this.p1.x, this.p1.y, this.p1.z],
            'p2': [this.p2.x, this.p2.y, this.p2.z],
            'p3': [this.p3.x, this.p3.y, this.p3.z],
        };
    }

    /**
     * @param {Plane} plane
     * @returns {Plane}
     */
    invertOnPlane(plane: Plane): Plane {
        const dp = Vector3.dot(this.normal, plane.normal);
        const nNormal = plane.normal.sub(this.normal.scale(2 * dp)).normalize();
        return new Plane(
            this.invertOnPoint(plane.p1),
            this.invertOnPoint(plane.p2),
            this.invertOnPoint(plane.p3),
            nNormal,
        );
    }

    /**
     * @param {Sphere} sphere
     * @returns {Sphere}
     */
    invertOnSphere(sphere: Sphere): Sphere {
        const nc = this.invertOnPoint(sphere.center);
        return new Sphere(nc.x, nc.y, nc.z, sphere.r);
    }

    /**
     * @param {Vector3} p
     * @returns {Vector3}
     */
    invertOnPoint(p: Vector3): Vector3 {
        let pos = p.sub(this.p1);
        const dp = Vector3.dot(this.normal, pos);
        pos = pos.sub(this.normal.scale(2 * dp));
        return pos.add(this.p1);
    }

    /**
     * @param {Plane} l1
     * @param {Plane} l2
     */
    static computeIntersection(l1: Plane, l2: Plane): Vector3 {
        const l1Eq = Plane.computeLineEquation(new Vec2(l1.p1.x, l1.p1.z), new Vec2(l1.p2.x, l1.p2.z));
        const l2Eq = Plane.computeLineEquation(new Vec2(l2.p1.x, l2.p1.z), new Vec2(l2.p3.x, l2.p3.z));
        if (l1Eq.x === 1 && l1Eq.y === 0) {
            return new Vector3(l1Eq.z, 0, Plane.calcY(l2Eq, l1Eq.z));
        } else if (l1Eq.x === 0 && l1Eq.y === 1) {
            return new Vector3(Plane.calcX(l2Eq, l1Eq.z), 0, l1Eq.z);
        } else if (l2Eq.x === 1 && l2Eq.y === 0) {
            return new Vector3(l2Eq.z, 0, Plane.calcY(l1Eq, l2Eq.z));
        } else if (l2Eq.x === 0 && l2Eq.y === 1) {
            return new Vector3(Plane.calcX(l1Eq, l2Eq.z), 0, l2Eq.z);
        } else {
            const x1 = 1.0;
            const x2 = 5.0;
            const y1 = Plane.calcY(l1Eq, x1);
            const y2 = Plane.calcY(l1Eq, x2);

            const x3 = 4.0;
            const x4 = 8.0;
            const y3 = Plane.calcY(l2Eq, x3);
            const y4 = Plane.calcY(l2Eq, x4);

            // http://mf-atelier.sakura.ne.jp/mf-atelier/modules/tips/program/algorithm/a1.html
            const ksi = (y4 - y3) * (x4 - x1) - (x4 - x3) * (y4 - y1);
            const eta = (x2 - x1) * (y4 - y1) - (y2 - y1) * (x4 - x1);
            const delta = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);

            const lambda = ksi / delta;
            const mu = eta / delta;

            return new Vector3(x1 + lambda * (x2 - x1), 0, y1 + lambda * (y2 - y1));
        }
    }

    static computeLineEquation(p1: Vec2, p2: Vec2): LineEquation {
        const xDiff = p2.x - p1.x;
        const yDiff = p2.y - p1.y;
        if (Math.abs(xDiff) < 0.000001) {
            // x = c
            return { x: 1, y: 0, z: p1.x };
        } else if (Math.abs(yDiff) < 0.000001) {
            // y = c
            return { x: 0, y: 1, z: p1.y };
        } else {
            // y = ax + b
            return { x: yDiff / xDiff, y: p1.y - p1.x * (yDiff / xDiff), z: 0 };
        }
    }

    static calcX(line: LineEquation, y: number): number {
        if (line.z === 0) {
            return (y - line.y) / line.x;
        } else {
            return line.z;
        }
    }

    static calcY(line: LineEquation, x: number): number {
        if (line.z === 0) {
            return line.x * x + line.y;
        } else {
            return line.z;
        }
    }
}
