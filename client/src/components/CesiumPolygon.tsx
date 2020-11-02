import {Entity, PolygonGraphics} from "resium";
import {Cartesian3, Color} from "cesium";
import React from "react";

type CesiumPolygonProps = {
    positions: number[];
    onClick: (moment: any, entity: any) => void;
}

export const CesiumPolygon = (props: CesiumPolygonProps) => (
    props.positions.length > 1 ?
        <Entity name="PolygonGraphics" description="PolygonGraphics" onClick={props.onClick}>
            <PolygonGraphics
                hierarchy={Cartesian3.fromDegreesArray(props.positions) as any}
                material={Color.RED.withAlpha(0.28)}
            />
        </Entity> : null
);