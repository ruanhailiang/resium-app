import React from "react";
import {CesiumPolygon} from "./CesiumPolygon";
import {TPolygons} from "./MainWindow";

type CesiumPolygonsProps = {
    polygons: TPolygons;
    handlePolygonRightClick: (moment: any, entity: any) => void;
    handlePolygonLeftClick: (moment: any, entity: any) => void;
}
export const CesiumPolygons: Function = (props: CesiumPolygonsProps): JSX.Element[] =>
    Array.from(props.polygons.entries(), ([name, positions]) =>
        <CesiumPolygon positions={positions}
                       name={name}
                       key={name}
                       handlePolygonRightClick={props.handlePolygonRightClick}
                       handlePolygonLeftClick={props.handlePolygonLeftClick}
        />)


