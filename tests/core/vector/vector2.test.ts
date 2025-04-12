import Vector2  from '../../../src/core/vector/vector2';
import { describe, it, expect } from 'vitest';

describe('Vector2', () => {
    it('should create a vector with given x and y', () => {
        const vector = new Vector2(1, 2);
        expect(vector.x).toBe(1);
        expect(vector.y).toBe(2);
    });

    it('should add two vectors correctly', () => {
        const v1 = new Vector2(1, 2);
        const v2 = new Vector2(3, 4);
        const result = v1.add(v2);
        expect(result.x).toBe(4);
        expect(result.y).toBe(6);
    });

    it('should subtract two vectors correctly', () => {
        const v1 = new Vector2(5, 6);
        const v2 = new Vector2(3, 4);
        const result = v1.sub(v2);
        expect(result.x).toBe(2);
        expect(result.y).toBe(2);
    });

    it('should multiply two vectors correctly', () => {
        const v1 = new Vector2(2, 3);
        const v2 = new Vector2(4, 5);
        const result = v1.prod(v2);
        expect(result.x).toBe(8);
        expect(result.y).toBe(15);
    });

    it('should divide two vectors correctly', () => {
        const v1 = new Vector2(8, 6);
        const v2 = new Vector2(2, 3);
        const result = v1.div(v2);
        expect(result.x).toBe(4);
        expect(result.y).toBe(2);
    });

    it('should scale a vector correctly', () => {
        const v = new Vector2(2, 3);
        const result = v.scale(2);
        expect(result.x).toBe(4);
        expect(result.y).toBe(6);
    });

    it('should calculate the length of a vector correctly', () => {
        const v = new Vector2(3, 4);
        expect(v.length()).toBe(5);
    });

    it('should normalize a vector correctly', () => {
        const v = new Vector2(3, 4);
        const result = v.normalize();
        expect(result.x).toBeCloseTo(0.6, 5);
        expect(result.y).toBeCloseTo(0.8, 5);
    });

    it('should check equality of two vectors correctly', () => {
        const v1 = new Vector2(1.000001, 2.000001);
        const v2 = new Vector2(1.000002, 2.000002);
        expect(v1.eq(v2)).toBe(true);
    });

    it('should calculate the dot product of two vectors correctly', () => {
        const v1 = new Vector2(1, 2);
        const v2 = new Vector2(3, 4);
        expect(Vector2.dot(v1, v2)).toBe(11);
    });

    it('should calculate the distance between two vectors correctly', () => {
        const v1 = new Vector2(1, 2);
        const v2 = new Vector2(4, 6);
        expect(Vector2.distance(v1, v2)).toBe(5);
    });
});