import React from "react";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from "clsx";
import CesiumMap from "./CesiumMap";
import NavHeader from "./NavHeader";
import NavDrawer from "./NavDrawer";
import ResultsModal from "./ResultsModal";
import {PopoverPosition} from "@material-ui/core";
import SelectionMenu from "./SelectionMenu";
import {CesiumMovementEvent} from "resium";
import {Cartographic, Entity as CesiumEntity, Math} from "cesium";
import {calcBoundingSphere} from "../util/PolygonUtil"

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }
    }),
);
export type TPolygons = Map<string, TPolygon>

export interface IShapeState {
    points: number[];
    polygons: TPolygons;
    counter: number;
}

//Remove duplicate in ResultsModal
export type TEvent = {
    time: string;
    name: string;
}

export interface IResultState {
    startTime: string;
    endTime: string;
    events: TEvent[];
}

export type TSphere = {
    centerX: number;
    centerY: number;
    radius: number;
}

//TODO: get better name, generalise for different shapes
export type TPolygon = {
    points: number[],
    boundingSphere: TSphere,
}

export default function MainWindow() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [createPolygon, setCreatePolygon] = React.useState<boolean>(false);
    const [anchorPosition, setAnchorPosition] = React.useState<PopoverPosition | undefined>(undefined);
    const [selectedPolygon, setSelectedPolygon] = React.useState<string | undefined>(undefined);
    const [showBoundingSphere, setShowBoundingSphere] = React.useState<boolean>(false);
    const [shapeState, setShapeState] = React.useState<IShapeState>({
        points: [],
        polygons: new Map<string, TPolygon>(),
        counter: 0
    });

    const [resultState, setResultState] = React.useState<IResultState>({
        startTime: "",
        endTime: "",
        events: []
    })

    const [startDate, setStartDate] = React.useState<Date | null>(
        new Date(),
    );

    const [endDate, setEndDate] = React.useState<Date | null>(
        new Date(),
    );

    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };


    const handleStartDateChange = (date: Date | null) => {
        //TODO: check date difference
        if (isValidDate(date) && isValidDate(endDate) && date! > endDate!) {
            setEndDate(date)
        }
        setStartDate(date);
    };

    const handleEndDateChange = (date: Date | null) => {
        //TODO: check date difference
        if (isValidDate(date) && isValidDate(endDate) && startDate! > date!) {
            setStartDate(date)
        }
        setEndDate(date);
    };
    const queryBackend = () => {
        //TODO: cleanup
        if (isValidDate(startDate) && isValidDate(endDate) && selectedPolygon && shapeState.polygons.get(selectedPolygon)) {
            let boundingSphere = shapeState.polygons.get(selectedPolygon)!.boundingSphere
            let startTime = startDate!.setHours(0, 0, 0)
            let endTime = endDate!.setHours(23, 59, 59)
            if (endTime - startTime < 3 * 24 * 60 * 60 * 1000) {
                fetch(`/query?startDate=${encodeURIComponent(startTime)}&endDate=${encodeURIComponent(endTime)}&centroidX=${encodeURIComponent(boundingSphere.centerX)}&centroidY=${encodeURIComponent(boundingSphere.centerY)}`)
                    .then(res => res.json())
                    .then(res => {
                        let queryResult = JSON.parse(res);
                        setResultState({
                            "startTime": queryResult["range"]["start"],
                            "endTime": queryResult["range"]["end"],
                            "events": queryResult["events"]
                        });
                        handleModalOpen();
                    });
            } else {
                //TODO: update ui
                console.log("Date difference is too big")
            }
        }
    }

    const isValidDate = (d: Date | null) => {
        return d !== null && !isNaN(d.getTime());
    }

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handlePolygonOptionClick = () => {
        if (createPolygon) {
            addPolygon();
        } else {
            setCreatePolygon(true);
        }
    }
    const addPoint = (longitude: number, latitude: number) => {
        setShapeState(prevState => ({
            ...prevState,
            points: [...prevState.points, longitude, latitude],
        }))
    }

    const addPolygon = () => {
        setCreatePolygon(false);
        setShapeState(prevState => ({
                    ...prevState,
                    points: [],
                    polygons: new Map<string, TPolygon>(prevState.polygons.set("Polygon" + prevState.counter, {
                        points: prevState.points,
                        boundingSphere: getBoundingSphere(prevState.points)
                    })),
                    counter: prevState.counter + 1
                }
            )
        )
    }

    const getBoundingSphere = (points: number[]): TSphere => {
        let bs = calcBoundingSphere(points);
        let c = Cartographic.fromCartesian(bs.center);
        return {
            centerX: Math.toDegrees(c.longitude),
            centerY: Math.toDegrees(c.latitude),
            radius: bs.radius
        }
    }

    const handlePolygonRightClick = (moment: CesiumMovementEvent, entity: CesiumEntity) => {
        let offset = drawerOpen ? 240 : 0;
        setAnchorPosition({left: moment.position!.x + offset, top: moment.position!.y + 64});
        setSelectedPolygon(entity.name);
    }

    const handlePolygonLeftClick = (moment: CesiumMovementEvent, entity: CesiumEntity) => {
        setSelectedPolygon(entity.name);
        // let points = shapeState.polygons.get(entity.name!);
        // if (points) {
        //     let bs = getBoundingSphere(points);
        //     let c = Cartographic.fromCartesian(bs.center)
        //     setBoundingSphere({centerX: Math.toDegrees(c.longitude), centerY: Math.toDegrees(c.latitude), radius: bs.radius, visible: false});
        // }
    }

    const handleSelectionMenuClose = () => {
        setAnchorPosition(undefined);
    };

    const handleUnselectPolygon = () => {
        setSelectedPolygon(undefined);
        setShowBoundingSphere(false);
    }

    const deleteFromPolygonMap = (polygons: TPolygons, selectedPolygon: string) => {
        let newPolygonMap = new Map<string, TPolygon>(polygons);
        newPolygonMap.delete(selectedPolygon);
        return newPolygonMap
    }

    const handlePolygonDelete = () => {
        if (selectedPolygon !== undefined) {
            setShapeState(prevState => ({
                    ...prevState,
                    polygons: deleteFromPolygonMap(prevState.polygons, selectedPolygon)
                }
            ))
        }
        setAnchorPosition(undefined);
        setSelectedPolygon(undefined);
    }

    const handleShowBoundingSphere = () => {
        setShowBoundingSphere(true);
        handleSelectionMenuClose();
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <NavHeader open={drawerOpen} onMenuClick={handleDrawerOpen} onSendClick={queryBackend} startDate={startDate}
                       onStartDateChange={handleStartDateChange} endDate={endDate}
                       onEndDateChange={handleEndDateChange} sendDisabled={selectedPolygon === undefined}/>
            <NavDrawer open={drawerOpen} createPolygon={createPolygon} onIconClick={handleDrawerClose}
                       onPolygonOptionClick={handlePolygonOptionClick}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: drawerOpen,
                })}
            >
                <div className={classes.drawerHeader}/>
                <CesiumMap polygons={shapeState.polygons} addPolygon={addPolygon} isCreatePolygon={createPolygon}
                           points={shapeState.points} addPoint={addPoint}
                           handlePolygonLeftClick={handlePolygonLeftClick}
                           handlePolygonRightClick={handlePolygonRightClick} handleUnselect={handleUnselectPolygon}
                           boundingSphere={selectedPolygon && showBoundingSphere ? shapeState.polygons.get(selectedPolygon)!.boundingSphere : undefined}/>
                <ResultsModal events={resultState.events} handleClose={handleModalClose} open={modalOpen}/>
                <SelectionMenu anchorPosition={anchorPosition} handleClose={handleSelectionMenuClose}
                               handleDelete={handlePolygonDelete}
                               handleDisplayBoundingSphere={handleShowBoundingSphere}/>
            </main>
        </div>
    );
}

