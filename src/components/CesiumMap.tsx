import React from "react";
import {Cartesian2, Math} from "cesium";
import {CesiumMovementEvent, Viewer} from "resium";
import {CesiumPoints} from "./CesiumPoints";
import {CesiumPolygons} from "./CesiumPolygons";
import {CesiumPolygon} from "./CesiumPolygon";
import throttle from 'lodash.throttle';

//https://github.com/darwin-education/resium/issues/219

type MyState = {
    points: number[];
    polygons: number[][];
    polygonEdit: number[];
    isCreatePolygon: boolean;
    isNewEditPoint: boolean;
};

type Coord = {
    latitude: number;
    longitude: number;
    height: number;
}

export default class CesiumMap extends React.Component<any, MyState> {
    private viewer: any;
    //type?
    private readonly modifyPolygonThrottled: any;

    constructor(props: any) {
        super(props);
        // this.cesium = React.createRef();
        this.state = {
            points: [],
            polygons: [],
            polygonEdit: [],
            isCreatePolygon: false,
            isNewEditPoint: true
        }
        this.addPolygon = this.addPolygon.bind(this);
        this.modifyPolygon = this.modifyPolygon.bind(this);
        this.modifyPolygonThrottled = throttle(this.modifyPolygon, 100);
    }

    getLocationFromScreenXY = (x: number, y: number): (Coord | undefined) => {
        //const scene = this.viewer.current?.cesiumElement?.scene;
        const scene = this.viewer.scene
        if (!scene) return undefined;
        const ellipsoid = scene.globe.ellipsoid;
        const cartesian = scene.camera.pickEllipsoid(new Cartesian2(x, y), ellipsoid);
        // return cartesian;
        if (!cartesian) return undefined;
        const {latitude, longitude, height} = ellipsoid.cartesianToCartographic(cartesian);
        return {latitude, longitude, height};
    }

    addPoint = (e: CesiumMovementEvent, entity: any) => {
        if (this.state.isCreatePolygon) {
            let coords = this.getLocationFromScreenXY(e.position.x, e.position.y);
            if (coords) {
                this.setState(prevState => ({
                    points: [...prevState.points, Math.toDegrees(coords!.longitude), Math.toDegrees(coords!.latitude)],
                    polygonEdit: [...prevState.points, Math.toDegrees(coords!.longitude), Math.toDegrees(coords!.latitude)],
                    isNewEditPoint: true
                }))
            }
        }
    }

    addPolygon = () => {
        this.setState(prevState => ({
            points: [],
            polygons: [...prevState.polygons, prevState.points],
            polygonEdit: [],
            isCreatePolygon: false
        }))
        console.log("Polygons test", this.state.polygons)
    }

    modifyPolygon = (e: { endPosition: { x: number; y: number; }; }, entity: any) => {
        //TODO: potential sync issues?
        let coords = this.getLocationFromScreenXY(e.endPosition.x, e.endPosition.y);
        if (coords) {
            let newPolygonEdit = [...this.state.polygonEdit];
            if (this.state.isNewEditPoint) {
                //add new point
                newPolygonEdit.push(Math.toDegrees(coords.longitude), Math.toDegrees(coords.latitude));
            } else {
                //edit last point
                newPolygonEdit[newPolygonEdit.length - 2] = Math.toDegrees(coords.longitude);
                newPolygonEdit[newPolygonEdit.length - 1] = Math.toDegrees(coords.latitude);
            }
            this.setState({
                polygonEdit: newPolygonEdit,
                isNewEditPoint: false
            })
        }
    }

    startCreatingPolygon = () => {
        this.setState({isCreatePolygon: true})
    }

    render() {
        return (
            <Viewer full ref={e => {
                this.viewer = e ? e.cesiumElement : null;
            }} onClick={this.addPoint} onMouseMove={this.modifyPolygonThrottled}>
                <CesiumPolygons polygons={this.state.polygons}/>
                <CesiumPoints points={this.state.points} onClick={this.addPolygon}/>
                <CesiumPolygon positions={this.state.polygonEdit} key="PolygonEdit"/>
                <button style={{left: '250px', top: '65px', position: 'fixed'}}
                        onClick={this.state.isCreatePolygon ? this.addPolygon : this.startCreatingPolygon}> {this.state.isCreatePolygon ? "Stop Draw" : "Start Draw"}
                </button>
            </Viewer>
        )
    }
}
