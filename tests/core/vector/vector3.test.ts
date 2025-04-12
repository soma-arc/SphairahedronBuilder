import Vector3 from '../../../src/core/vector/vector3';
import { describe, it, expect } from 'vitest';

describe('Vector3', () => {
    it('should create a vector with given x, y, and z', () => {
        const vector = new Vector3(1, 2, 3);
        expect(vector.x).toBe(1);
        expect(vector.y).toBe(2);
        expect(vector.z).toBe(3);
    });

    it('should add two vectors correctly', () => {
        const v1 = new Vector3(1, 2, 3);
        const v2 = new Vector3(4, 5, 6);
        const result = v1.add(v2);
        expect(result.x).toBe(5);
        expect(result.y).toBe(7);
        expect(result.z).toBe(9);
    });

    it('should subtract two vectors correctly', () => {
        const v1 = new Vector3(7, 8, 9);
        const v2 = new Vector3(4, 5, 6);
        const result = v1.sub(v2);
        expect(result.x).toBe(3);
        expect(result.y).toBe(3);
        expect(result.z).toBe(3);
    });

    it('should multiply two vectors correctly', () => {
        const v1 = new Vector3(2, 3, 4);
        const v2 = new Vector3(5, 6, 7);
        const result = v1.prod(v2);
        expect(result.x).toBe(10);
        expect(result.y).toBe(18);
        expect(result.z).toBe(28);
    });

    it('should divide two vectors correctly', () => {
        const v1 = new Vector3(8, 9, 10);
        const v2 = new Vector3(2, 3, 5);
        const result = v1.div(v2);
        expect(result.x).toBe(4);
        expect(result.y).toBe(3);
        expect(result.z).toBe(2);
    });

    it('should scale a vector correctly', () => {
        const v = new Vector3(2, 3, 4);
        const result = v.scale(2);
        expect(result.x).toBe(4);
        expect(result.y).toBe(6);
        expect(result.z).toBe(8);
    });

    it('should calculate the length of a vector correctly', () => {
        const v = new Vector3(1, 2, 2);
        expect(v.length()).toBe(3);
    });

    it('should normalize a vector correctly', () => {
        const v = new Vector3(1, 2, 2);
        const result = v.normalize();
        expect(result.x).toBeCloseTo(1 / 3, 5);
        expect(result.y).toBeCloseTo(2 / 3, 5);
        expect(result.z).toBeCloseTo(2 / 3, 5);
    });

    it('should check equality of two vectors correctly', () => {
        const v1 = new Vector3(1.0000001, 2.0000001, 3.0000001);
        const v2 = new Vector3(1.0000002, 2.0000002, 3.0000002);
        expect(v1.eq(v2)).toBe(true);
    });

    it('should calculate the dot product of two vectors correctly', () => {
        const v1 = new Vector3(1, 2, 3);
        const v2 = new Vector3(4, 5, 6);
        expect(Vector3.dot(v1, v2)).toBe(32);
    });

    it('should calculate the distance between two vectors correctly', () => {
        const v1 = new Vector3(1, 2, 3);
        const v2 = new Vector3(4, 5, 6);
        expect(Vector3.distance(v1, v2)).toBeCloseTo(5.196, 3);
    });
});