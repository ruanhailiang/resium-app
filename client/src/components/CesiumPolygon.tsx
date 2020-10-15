import {Entity, PolygonGraphics} from "resium";
import {Cartesian3, Color} from "cesium";
import React from "react";

export const CesiumPolygon = (props: { positions: number[] }) => (
    props.positions.length > 1 ?
        <Entity name="PolygonGraphics" description="PolygonGraphics">
            <PolygonGraphics
                hierarchy={Cartesian3.fromDegreesArray(props.positions) as any}
                material={Color.RED.withAlpha(0.28)}
            />
        </Entity> : null
);