import React from "react";
import {Cartesian2, Entity as CesiumEntity, Math, Viewer as CesiumViewer} from "cesium";
import {CesiumMovementEvent, Viewer} from "resium";
import {CesiumPoints} from "./CesiumPoints";
import {CesiumPolygons} from "./CesiumPolygons";
import {CesiumPolygon} from "./CesiumPolygon";
import throttle from 'lodash.throttle';
import {TPolygons} from "./MainWindow";
import {CentroidPoint} from "./CentroidPoint";

//https://github.com/darwin-education/resium/issues/219

type CesiumMapProps = {
    points: number[];
    polygons: TPolygons;
    isCreatePolygon: boolean;
    addPoint: (lon: number, lat: number) => void;
    addPolygon: () => void;
    handlePolygonLeftClick: (moment: CesiumMovementEvent, entity: CesiumEntity) => void;
    handlePolygonRightClick: (moment: CesiumMovementEvent, entity: CesiumEntity) => void;
    handleUnselect: () => void;
    centroid: [number, number] | undefined;
};

type Coord = {
    latitude: number;
    longitude: number;
    height: number;
}

type CesiumMapState = {
    nextPoint: [number, number] | undefined;
}

export default class CesiumMap extends React.Component<CesiumMapProps, CesiumMapState> {
    private viewer?: CesiumViewer | null;
    private readonly modifyPolygonThrottled: (movement: CesiumMovementEvent, target: CesiumEntity) => void;

    constructor(props: CesiumMapProps) {
        super(props);
        // this.cesium = React.createRef();
        this.modifyPolygon = this.modifyPolygon.bind(this);
        this.modifyPolygonThrottled = throttle(this.modifyPolygon, 100);
        this.state = {
            nextPoint: undefined
        }
    }

    componentDidMount() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    };

    getLocationFromScreenXY = (x: number, y: number): (Coord | undefined) => {
        //const scene = this.viewer.current?.cesiumElement?.scene;
        const scene = this.viewer?.scene
        if (!scene) return undefined;
        const ellipsoid = scene.globe.ellipsoid;
        const cartesian = scene.camera.pickEllipsoid(new Cartesian2(x, y), ellipsoid);
        // return cartesian;
        if (!cartesian) return undefined;
        const {latitude, longitude, height} = ellipsoid.cartesianToCartographic(cartesian);
        return {latitude, longitude, height};
    }

    addPoint = (e: CesiumMovementEvent, entity: CesiumEntity) => {
        if (this.props.isCreatePolygon && e.position) {
            let coords = this.getLocationFromScreenXY(e.position.x, e.position.y);
            if (coords) {
                this.props.addPoint(Math.toDegrees(coords!.longitude), Math.toDegrees(coords!.latitude));
                this.setState({
                    nextPoint: undefined
                })
            }
        }
    }

    modifyPolygon = (e: CesiumMovementEvent, entity: CesiumEntity) => {
        if (!this.props.isCreatePolygon) return;
        let coords = this.getLocationFromScreenXY(e.endPosition!.x, e.endPosition!.y);
        if (coords) {
            let longitude = Math.toDegrees(coords.longitude);
            let latitude = Math.toDegrees(coords.latitude);
            this.setState({
                nextPoint: [longitude, latitude]
            });
        }
    }

    addPolygon = () => {
        this.props.addPolygon();
        this.setState({
            nextPoint: undefined
        });
    }

    handlePolygonRightClick = (moment: CesiumMovementEvent, entity: CesiumEntity) => {
        this.props.handlePolygonRightClick(moment, entity);
        if (this.viewer) {
            this.viewer.zoomTo(entity);
            this.viewer.selectedEntity = entity;
        }
    }

    handlePolygonLeftClick = (moment: CesiumMovementEvent, entity: CesiumEntity) => {
        this.props.handlePolygonLeftClick(moment, entity);
        if (this.viewer) {
            this.viewer.zoomTo(entity);
            this.viewer.selectedEntity = entity;
        }
    }

    handleSelectedEntityChange = () => {
        if (this.viewer?.selectedEntity === undefined) {
            this.props.handleUnselect();
        }
    }

    render() {
        return (
            <Viewer ref={e => {
                this.viewer = e ? e.cesiumElement : null;
            }} onClick={this.addPoint} onMouseMove={this.modifyPolygonThrottled} onSelectedEntityChange={
                this.handleSelectedEntityChange}>
                <CesiumPolygons
                    polygons={this.props.polygons}
                    handlePolygonRightClick={this.handlePolygonRightClick}
                    handlePolygonLeftClick={this.handlePolygonLeftClick}
                />
                <CesiumPoints points={this.props.points} onClick={this.addPolygon}/>
                <CesiumPolygon
                    positions={this.state.nextPoint ? this.props.points.concat(this.state.nextPoint) : this.props.points}
                    name="PolygonEdit" key="PolygonEdit"
                    handlePolygonRightClick={() => undefined} handlePolygonLeftClick={() => undefined}/>
                <CentroidPoint point={this.props.centroid}/>
            </Viewer>
        )
    }
}
