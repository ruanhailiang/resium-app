import React from "react";
import {hot} from "react-hot-loader";
import {Cartesian3} from "cesium";
import CesiumMap from "./components/CesiumMap";

const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const App = () => (
    <CesiumMap/>
    // <Viewer full>
    //     <CesiumPolygons polygons={[[-74.0707383, 40.7117244, -80.0707383, 35.7117244, -100.0707383, 70.7117244],
    //         [-75.0707383, 20.7117244, -70.0707383, 22.7117244, -73.0707383, 15.7117244]]}/>
    //     <CesiumPoints points={[-74.0707383, 40.7117244, -80.0707383, 35.7117244, -100.0707383, 70.7117244]}/>
    // </Viewer>
);

declare const module: any;
export default hot(module)(App);