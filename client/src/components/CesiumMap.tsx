import React from "react";
import {Cartesian2, Math} from "cesium";
import {CesiumMovementEvent, Viewer} from "resium";
import {CesiumPoints} from "./CesiumPoints";
import {CesiumPolygons} from "./CesiumPolygons";
import {CesiumPolygon} from "./CesiumPolygon";
import throttle from 'lodash.throttle';

//https://github.com/darwin-education/resium/issues/219

type CesiumMapProps = {
    points: number[];
    polygons: number[][];
    polygonEdit: number[];
    isCreatePolygon: boolean;
    isNewEditPoint: boolean;
    addPoint: (lon: number, lat: number) => void;
    addPolygon: () => void;
    modifyPolygon: (lon: number, lat: number) => void;
};

type Coord = {
    latitude: number;
    longitude: number;
    height: number;
}

export default class CesiumMap extends React.Component<CesiumMapProps> {
    private viewer: any;
    //type?
    private readonly modifyPolygonThrottled: any;

    constructor(props: CesiumMapProps) {
        super(props);
        // this.cesium = React.createRef();
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
        if (this.props.isCreatePolygon && e.position) {
            let coords = this.getLocationFromScreenXY(e.position.x, e.position.y);
            if (coords) {
                this.props.addPoint(Math.toDegrees(coords!.longitude), Math.toDegrees(coords!.latitude));
            }
        }
    }

    modifyPolygon = (e: { endPosition: { x: number; y: number; }; }, entity: any) => {
        let coords = this.getLocationFromScreenXY(e.endPosition.x, e.endPosition.y);
        if (coords) {
            this.props.modifyPolygon(Math.toDegrees(coords.longitude), Math.toDegrees(coords.latitude));
        }
    }

    render() {
        return (
            <Viewer ref={e => {
                this.viewer = e ? e.cesiumElement : null;
            }} onClick={this.addPoint} onMouseMove={this.modifyPolygonThrottled}>
                <CesiumPolygons polygons={this.props.polygons}/>
                <CesiumPoints points={this.props.points} onClick={this.props.addPolygon}/>
                <CesiumPolygon positions={this.props.polygonEdit} key="PolygonEdit"/>
            </Viewer>
        )
    }
}
