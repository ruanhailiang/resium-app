import {CesiumMovementEvent, Entity, PointGraphics} from "resium";
import {Cartesian3} from "cesium";
import React from "react";

type CesiumPointsProps = {
    points: number[];
    onClick: (e: CesiumMovementEvent, entity: any) => void;
}
export const CesiumPoints : Function = (props : CesiumPointsProps): JSX.Element[] => {
    let pointGraphics = [];
    for (let i = 0; i < props.points.length; i += 2) {
        let x = props.points[i]
        let y = props.points[i + 1]
        pointGraphics.push(
            <Entity key={"Point" + (i / 2)} position={Cartesian3.fromDegrees(x, y, 100)} name="Tokyo"
                    description="Hello, world."
                    onClick={props.onClick}>
                <PointGraphics pixelSize={10}/>
            </Entity>)
    }
    return pointGraphics;
}
