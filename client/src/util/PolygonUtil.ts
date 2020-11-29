import {BoundingSphere, Cartesian3} from "cesium";

export function getCentroid(pts: number[]): [number, number] {
    let firstX = pts[0], firstY = pts[1], lastX = pts[pts.length - 1], lastY = pts[pts.length - 1];
    if (firstX !== lastX || firstY !== lastY) pts.push(firstX, firstY);
    let twicearea = 0,
        x = 0, y = 0,
        nPts = pts.length,
        p1X, p1Y, p2X, p2Y, f;
    for (let i = 0, j = nPts - 2; i < nPts - 1; j = i, i = i + 2) {
        p1X = pts[i];
        p1Y = pts[i + 1];
        p2X = pts[j];
        p2Y = pts[j + 1];
        f = p1X * p2Y - p2X * p1Y;
        twicearea += f;
        x += (p1X + p2X) * f;
        y += (p1Y + p2Y) * f;
    }
    f = twicearea * 3;
    return [x / f, y / f];
}

export function calcBoundingSphere(pts: number[]): BoundingSphere {
    let cartesianPoints : Cartesian3[] = [];
    for (let i = 0; i < pts.length; i+=2) {
        cartesianPoints.push(Cartesian3.fromDegrees(pts[i], pts[i+1], 0))
    }
    return BoundingSphere.fromPoints(cartesianPoints);
}