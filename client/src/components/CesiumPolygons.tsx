import React from "react";
import {CesiumPolygon} from "./CesiumPolygon";
import {TPolygons} from "./MainWindow";
import {CesiumMovementEvent} from "resium";
import {Entity as CesiumEntity} from "cesium";

type CesiumPolygonsProps = {
    polygons: TPolygons;
    handlePolygonRightClick: (moment: CesiumMovementEvent, entity: CesiumEntity) => void;
    handlePolygonLeftClick: (moment: CesiumMovementEvent, entity: CesiumEntity) => void;
}
export const CesiumPolygons: Function = (props: CesiumPolygonsProps): JSX.Element[] =>
    Array.from(props.polygons.entries(), ([name, polygon]) =>
        <CesiumPolygon positions={polygon.points}
                       name={name}
                       key={name}
                       handlePolygonRightClick={props.handlePolygonRightClick}
                       handlePolygonLeftClick={props.handlePolygonLeftClick}
        />)
