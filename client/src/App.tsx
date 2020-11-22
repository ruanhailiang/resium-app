import React from "react";
import {hot} from "react-hot-loader";
import MainWindow from "./components/MainWindow"
// const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const App = () => (
    <MainWindow/>
);

declare const module: any;
export default hot(module)(App);