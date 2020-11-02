import React from "react";
import {CesiumPolygon} from "./CesiumPolygon";

type CesiumPolygonsProps = {
    polygons: number[][];
    onPolygonClick: (moment: any, entity: any) => void;
}
export const CesiumPolygons: Function = (props: CesiumPolygonsProps): JSX.Element[] =>
    props.polygons.map((positions, index) =>
        <CesiumPolygon positions={positions} key={"Polygon" + index} onClick={props.onPolygonClick}/>
    )

