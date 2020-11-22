import React from "react";
import {Entity, PointGraphics} from "resium";
import {Cartesian3} from "cesium";

export const CentroidPoint: Function = (props: { point: [number, number] }): JSX.Element | null => {
    if (!props.point) {
        return null;
    }
    let x = props.point[0]
    let y = props.point[1]
    return (
        <Entity key={"Centroid"} position={Cartesian3.fromDegrees(x, y, 100)}>
            <PointGraphics pixelSize={10}/>
        </Entity>
    );
}
