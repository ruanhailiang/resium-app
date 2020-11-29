import {CesiumMovementEvent, Entity, PolygonGraphics} from "resium";
import {Cartesian3, Color, Entity as CesiumEntity, PolygonHierarchy} from "cesium";
import React from "react";


type CesiumPolygonProps = {
    positions: number[];
    handlePolygonLeftClick: (moment: CesiumMovementEvent, target: CesiumEntity) => void | undefined;
    handlePolygonRightClick: (moment: CesiumMovementEvent, target: CesiumEntity) => void | undefined;
    name: string;
}

export const CesiumPolygon = (props: CesiumPolygonProps) => (
    props.positions.length > 1 ?
        <Entity name={props.name} description="PolygonGraphics" onClick={props.handlePolygonLeftClick}
                onRightClick={props.handlePolygonRightClick}>
            <PolygonGraphics
                hierarchy={new PolygonHierarchy(Cartesian3.fromDegreesArray(props.positions))}
                material={Color.RED.withAlpha(0.25)}
            />
        </Entity> : null
);