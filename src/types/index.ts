/**
 * 球面多面体の型定義
 */

/**
 * 更新リスナーの型
 */
export type UpdateListener = () => void;

/**
 * バウンディングボックスの型
 */
export interface BoundingBox {
    min: [number, number, number];
    max: [number, number, number];
}

/**
 * プリズム平面の型
 */
export enum PrismType {
    TYPE_333 = '333', // 3-3-3型
    TYPE_236 = '236', // 2-3-6型
    TYPE_244 = '244', // 2-4-4型
    TYPE_2222 = '2222', // 2-2-2-2型（正方形）
}

/**
 * シェーダータイプ
 */
export enum ShaderType {
    PRISM = 'prism',
    SPHAIRAHEDRA = 'sphairahedra',
    LIMITSET = 'limitset',
    PARAMETER = 'parameter',
}

/**
 * 球面多面体のパラメータ
 */
export interface SphairahedronParams {
    zb: number; // 球面多面体のパラメータ
    zc: number; // 球面多面体のパラメータ
}

/**
 * 球面のパラメータ
 */
export interface SphereParams {
    center: [number, number, number]; // 中心点
    radius: number; // 半径
}

/**
 * 平面のパラメータ
 */
export interface PlaneParams {
    point1: [number, number, number]; // 点1
    point2: [number, number, number]; // 点2
    point3: [number, number, number]; // 点3
    normal: [number, number, number]; // 法線ベクトル
}
