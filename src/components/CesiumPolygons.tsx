import React from "react";
import {CesiumPolygon} from "./CesiumPolygon";


export const CesiumPolygons: Function = (props: { polygons: number[][] }): JSX.Element[] =>
    props.polygons.map((positions, index) =>
        <CesiumPolygon positions={positions} key={"Polygon" + index}/>
    )

