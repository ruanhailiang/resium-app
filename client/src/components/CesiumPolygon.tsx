import {CesiumMovementEvent, Entity, PolygonGraphics} from "resium";
import {Cartesian3, Color} from "cesium";
import React from "react";


type CesiumPolygonProps = {
    positions: number[];
    handlePolygonClick: (moment: CesiumMovementEvent, target: any) => void | undefined;
    name: string;
}

export const CesiumPolygon = (props: CesiumPolygonProps) => (
    props.positions.length > 1 ?
        <Entity name={props.name} description="PolygonGraphics" onRightClick={props.handlePolygonClick}>
            <PolygonGraphics
                hierarchy={Cartesian3.fromDegreesArray(props.positions) as any}
                material={Color.RED.withAlpha(0.28)}
            />
        </Entity> : null
);