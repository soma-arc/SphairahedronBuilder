import Sphere from './sphere';
import Plane from './plane';
import Vector3 from './vector/vector3';
import Vector2 from './vector/vector2';

const RT_3 = Math.sqrt(3);
const RT_3_INV = 1.0 / Math.sqrt(3);

interface UpdateListener {
    (): void;
}

interface BoundingBox {
    min: [number, number, number];
    max: [number, number, number];
}

export default class Sphairahedron {
    zb: number;
    zc: number;
    updateListeners: UpdateListener[];
    selectedComponentId: number;
    pointRadius: number;
    lineWidth: number;
    numFaces: number;
    numSpheres: number;
    numPlanes: number;
    vertexIndexes: number[][];
    numVertexes: number;
    vertexes: Vector3[];
    numDividePlanes: number;
    numExcavationSpheres: number;
    enableSlice: boolean;
    currentSliceIndex: number;
    maxSlicePlanes: number;
    quasiSphereSlicePlane: Plane;
    quasiSphereSlicePlaneFlipNormal: boolean;
    useFlashLight: boolean;
    prismSpheres: Sphere[];
    planes: Plane[];
    boundingPlanes: Plane[];
    constrainsInversionSphere: boolean;
    inversionSphere: Sphere;
    bboxMin: [number, number, number];
    bboxMax: [number, number, number];
    twoDividePlanes: boolean;
    gSpheres: Sphere[];
    dividePlanes: Plane[];
    convexSpheres: Sphere[];
    boundingSphere: Sphere;
    excavationPrismSpheres: Sphere[];
    excavationSpheres: Sphere[];
    seedSpheres: Sphere[];
    boundingPlaneY: number;

    constructor(zb: number, zc: number) {
        this.zb = zb;
        this.zc = zc;
        this.updateListeners = [];

        this.selectedComponentId = -1;
        this.pointRadius = 0.02;
        this.lineWidth = 0.01;

        this.numFaces = 0;
        this.numSpheres = 0;
        this.numPlanes = 0;
        this.vertexIndexes = [];
        this.numVertexes = this.vertexIndexes.length;
        this.vertexes = [];
        this.numDividePlanes = 1;
        this.numExcavationSpheres = 0;
        this.enableSlice = false;
        this.currentSliceIndex = 0;
        this.maxSlicePlanes = 12;
        this.quasiSphereSlicePlane = new Plane(
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            new Vector3(0, 0, 0),
            new Vector3(1, 0, 0),
        );
        this.quasiSphereSlicePlaneFlipNormal = false;
        this.useFlashLight = false;

        this.prismSpheres = new Array(3);
        this.planes = [];
        this.boundingPlanes = [];

        this.constrainsInversionSphere = true;
        this.inversionSphere = new Sphere(0, 0, 0, 1);

        this.bboxMin = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
        this.bboxMax = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE];

        this.twoDividePlanes = false;

        // Initialize remaining properties
        this.gSpheres = [];
        this.dividePlanes = [];
        this.convexSpheres = [];
        this.boundingSphere = new Sphere(0, 0, 0, 1);
        this.excavationPrismSpheres = [];
        this.excavationSpheres = [];
        this.seedSpheres = [];
        this.boundingPlaneY = Number.MIN_VALUE;
    }

    toJson(): any {
        const prismPlanes = this.planes.map((p) => {
            return p.toJson();
        });
        const prismSpheres = this.prismSpheres.map((s) => {
            return s.toJson();
        });
        const finiteSpheres = this.gSpheres.map((s) => {
            return s.toJson();
        });
        const divPlanes = this.dividePlanes.map((p) => {
            return p.toJson();
        });
        const convexSpheres = this.convexSpheres.map((p) => {
            return p.toJson();
        });
        const boundingSphere = this.boundingSphere.toJson();

        const intersections = [];
        const planeIntersectionIndexes3 = [[0, 1], [0, 2], [1, 2]];
        const planeIntersectionIndexes4 = [[0, 1], [0, 3], [2, 1], [2, 3]];
        if (this.planes.length === 3) {
            for (const indexes of planeIntersectionIndexes3) {
                intersections.push(Plane.computeIntersection(this.planes[indexes[0]], this.planes[indexes[1]]));
            }
        } else if (this.planes.length === 4) {
            for (const indexes of planeIntersectionIndexes4) {
                intersections.push(Plane.computeIntersection(this.planes[indexes[0]], this.planes[indexes[1]]));
            }
        }

        for (const s of this.prismSpheres) {
            this.bboxMin[1] = Math.min(this.bboxMin[1], s.center.y - 0.1);
            this.bboxMax[1] = Math.max(this.bboxMax[1], s.center.y + 0.1);
        }

        const data = {
            'zb': this.zb,
            'zc': this.zc,
            'inversionSphere': this.inversionSphere.toJson(),
            'prismPlanes': prismPlanes,
            'prismSpheres': prismSpheres,
            'finiteSpheres': finiteSpheres,
            'dividePlanes': divPlanes,
            'convexSpheres': convexSpheres,
            'boundingSphere': boundingSphere,
            'boundingPlanes': this.boundingPlanes.map((p) => {
                return p.toJson();
            }),
            'bboxMin': this.bboxMin,
            'bboxMax': this.bboxMax,
        };

        return data;
    }

    addUpdateListener(listener: UpdateListener): void {
        this.updateListeners.push(listener);
    }

    updated(): void {
        for (const listener of this.updateListeners) {
            listener();
        }
    }

    update(): void {
        this.computeInversionSphere();
        this.computeSpheres();
        this.computeGenSpheres();
        this.computeVertexes();
        this.computeDividePlanes();
        this.computeExcavationSpheres();
        this.computeSeedSpheres();
        this.computeConvexSphere();
        this.computeBoundingVolume();
        this.updated();
    }

    computeInversionSphere(): void {}

    computeSpheres(): void {}

    computeGenSpheres(): void {}

    computeVertexes(): void {
        this.vertexes = [];
        for (const vert of this.vertexIndexes) {
            this.vertexes.push(
                this.computeIdealVertex(this.gSpheres[vert[0]], this.gSpheres[vert[1]], this.gSpheres[vert[2]]),
            );
        }
    }

    computePlane(vertexIdx1: number, vertexIdx2: number, vertexIdx3: number): Plane {
        const p1 = this.inversionSphere.invertOnPoint(this.vertexes[vertexIdx1]);
        const p2 = this.inversionSphere.invertOnPoint(this.vertexes[vertexIdx2]);
        const p3 = this.inversionSphere.invertOnPoint(this.vertexes[vertexIdx3]);

        const v1 = p2.sub(p1);
        const v2 = p3.sub(p1);
        let normal = Vector3.cross(v1, v2).normalize();
        if (normal.y < 0) {
            normal = normal.scale(-1);
        }
        return new Plane(p1, p2, p3, normal);
    }

    computeDividePlanes(): void {
        this.dividePlanes = [];
        this.dividePlanes.push(this.computePlane(0, 1, 2));
    }

    computeExcavationSpheres(): void {
        this.excavationPrismSpheres = [];
        this.excavationSpheres = [];
    }

    computeSeedSpheres(): void {
        this.seedSpheres = [];
        for (let i = 0; i < this.numVertexes; i++) {
            this.addSphereIfNotExists(
                this.seedSpheres,
                this.computeMinSeedSphere(
                    this.vertexes[i],
                    this.vertexes,
                    this.gSpheres[this.vertexIndexes[i][0]],
                    this.gSpheres[this.vertexIndexes[i][1]],
                    this.gSpheres[this.vertexIndexes[i][2]],
                ),
            );
        }
    }

    computeConvexSphere(): void {
        this.convexSpheres = [];
        for (let i = 0; i < this.numDividePlanes; i++) {
            this.convexSpheres.push(this.inversionSphere.invertOnPlane(this.dividePlanes[i]));
        }
    }

    computeBoundingVolume(): void {
        this.boundingPlaneY = Number.MIN_VALUE;
        let boundingPlaneMinY = Number.MAX_VALUE;
        for (const s of this.prismSpheres) {
            this.boundingPlaneY = Math.max(this.boundingPlaneY, s.center.y);
            boundingPlaneMinY = Math.min(boundingPlaneMinY, s.center.y);
        }
        if (this.inversionSphere.center.y < boundingPlaneMinY) {
            this.boundingSphere = this.inversionSphere.invertOnPlane(
                new Plane(
                    new Vector3(1, boundingPlaneMinY, -9),
                    new Vector3(-4, boundingPlaneMinY, -4),
                    new Vector3(10, boundingPlaneMinY, 3),
                    new Vector3(0, 1, 0),
                ),
            );
        } else {
            this.boundingSphere = this.inversionSphere.invertOnPlane(
                new Plane(
                    new Vector3(1, this.boundingPlaneY, -9),
                    new Vector3(-4, this.boundingPlaneY, -4),
                    new Vector3(10, this.boundingPlaneY, 3),
                    new Vector3(0, 1, 0),
                ),
            );
        }
        this.boundingPlaneY += 1.01;
        this.boundingSphere.r *= 1.01;
        this.boundingSphere.update();
    }

    computeSeedSphere(x: Vector3, y: Vector3, a: Sphere, b: Sphere, c: Sphere): Sphere {
        const ab = b.center.sub(a.center);
        const ac = c.center.sub(a.center);
        const n = Vector3.cross(ab, ac);
        const k = Vector3.dot(y.sub(x), n) / (2 * Vector3.dot(y.sub(x), n));
        const center = x.add(n.scale(k));
        return new Sphere(center.x, center.y, center.z, Math.abs(k) * n.length());
    }

    addSphereIfNotExists(spheres: Sphere[], sphere: Sphere): void {
        for (const s of spheres) {
            if (
                Math.abs(s.r - sphere.r) < 0.00001
                && Vector3.distance(s.center, sphere.center) < 0.00001
            ) {
                console.log('duplicate');
                //                return;
            }
        }
        spheres.push(sphere);
    }

    /**
     * @param {Sphere} a
     * @param {Sphere} b
     * @param {Sphere} c
     * @returns {Vec3}
     */
    computeIdealVertex(a: Sphere, b: Sphere, c: Sphere): Vector3 {
        const AB = (a.center.squaredLength() - b.center.squaredLength() - a.r * a.r + b.r * b.r) * 0.5
            - a.center.squaredLength() + Vector3.dot(a.center, b.center);
        const AC = (a.center.squaredLength() - c.center.squaredLength() - a.r * a.r + c.r * c.r) * 0.5
            - a.center.squaredLength() + Vector3.dot(a.center, c.center);
        const x = -a.center.squaredLength() - b.center.squaredLength() + 2 * Vector3.dot(a.center, b.center);
        const y = -a.center.squaredLength() - c.center.squaredLength() + 2 * Vector3.dot(a.center, c.center);
        const z = -a.center.squaredLength() + Vector3.dot(a.center, b.center)
            + Vector3.dot(a.center, c.center) - Vector3.dot(b.center, c.center);
        const s = (AB * y - AC * z) / (x * y - z * z);
        const t = (AC * x - AB * z) / (x * y - z * z);
        return a.center.add((b.center.sub(a.center)).scale(s)).add((c.center.sub(a.center)).scale(t));
    }

    computeMinSeedSphere(x: Vector3, vertexes: Vector3[], a: Sphere, b: Sphere, c: Sphere): Sphere {
        let minSphere = new Sphere(0, 0, 0, 99999999999);
        for (const ov of vertexes) {
            if (Vector3.distance(x, ov) < 0.000001) {
                // x === ov
                continue;
            }
            const s = this.computeSeedSphere(x, ov, a, b, c);
            if (s.r < minSphere.r) {
                minSphere = s;
            }
        }
        return minSphere;
    }

    static get SHADER_TYPE_PRISM(): string {
        return 'prism';
    }

    static get SHADER_TYPE_SPHAIRAHEDRA(): string {
        return 'sphairahedra';
    }

    static get SHADER_TYPE_LIMITSET(): string {
        return 'limitset';
    }

    static get SHADER_TYPE_PARAMETER(): string {
        return 'parameter';
    }

    static get POINT_ZB_ZC(): string {
        return 'point_zb_zc';
    }

    static get PRISM_PLANES_333(): Plane[] {
        // AB - CA - BC
        return [
            new Plane(
                new Vector3(0, 5, RT_3_INV),
                new Vector3(1, 1, 0),
                new Vector3(2, 2, -RT_3_INV),
                new Vector3(RT_3 * 0.5, 0, 1.5).normalize(),
            ),
            new Plane(
                new Vector3(0, 3, -RT_3_INV),
                new Vector3(1, 3, 0),
                new Vector3(2, 2, RT_3_INV),
                new Vector3(RT_3 * 0.5, 0, -1.5).normalize(),
            ),
            new Plane(new Vector3(-0.5, 0, 1), new Vector3(-0.5, 1, 0), new Vector3(-0.5, 2, 1), new Vector3(-1, 0, 0)),
        ];
    }

    static get PRISM_PLANES_236(): Plane[] {
        // AB - CA - BC
        return [
            new Plane(
                new Vector3(0.5, 5, RT_3 * 0.5),
                new Vector3(1, 1, 0),
                new Vector3(0.75, 2, RT_3 * 0.25),
                new Vector3(1, 0, RT_3_INV).normalize(),
            ),
            new Plane(
                new Vector3(1, 0, 0),
                new Vector3(0, 5, -RT_3 / 3),
                new Vector3(-0.5, 2, -RT_3 * 0.5),
                new Vector3(1, 0, -RT_3).normalize(),
            ),
            new Plane(
                new Vector3(0.5, 3, RT_3 * 0.5),
                new Vector3(0, -10, 0),
                new Vector3(-0.5, -3, -RT_3 * 0.5),
                new Vector3(-1, 0, RT_3_INV).normalize(),
            ),
        ];
    }

    static get PRISM_PLANES_244(): Plane[] {
        // AB - CA - BC
        return [
            new Plane(
                new Vector3(0, 5, 1),
                new Vector3(0.5, 1, 0.5),
                new Vector3(1, 2, 0),
                new Vector3(0.5, 0, 0.5).normalize(),
            ),
            new Plane(
                new Vector3(0, 3, -1),
                new Vector3(0.5, 3, -0.5),
                new Vector3(1, 2, 0),
                new Vector3(0.5, 0, -0.5).normalize(),
            ),
            new Plane(new Vector3(0, -7, 1), new Vector3(0, -4, 0), new Vector3(0, 8, -1), new Vector3(-1, 0, 0)),
        ];
    }

    static get PRISM_PLANES_2222_SQUARE(): Plane[] {
        return [
            new Plane(
                new Vector3(0, 5, 1),
                new Vector3(0.5, 1, 0.5),
                new Vector3(1, 2, 0),
                new Vector3(0.5, 0, 0.5).normalize(),
            ),
            new Plane(
                new Vector3(0, 5, 1),
                new Vector3(-0.5, 1, 0.5),
                new Vector3(-1, 2, 0),
                new Vector3(-0.5, 0, 0.5).normalize(),
            ),
            new Plane(
                new Vector3(0, 5, -1),
                new Vector3(-0.5, 1, -0.5),
                new Vector3(-1, 2, 0),
                new Vector3(-0.5, 0, -0.5).normalize(),
            ),
            new Plane(
                new Vector3(0, 3, -1),
                new Vector3(0.5, 3, -0.5),
                new Vector3(1, 2, 0),
                new Vector3(0.5, 0, -0.5).normalize(),
            ),
        ];
    }
}
