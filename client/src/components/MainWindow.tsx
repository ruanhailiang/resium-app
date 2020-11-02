import React from "react";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from "clsx";
import CesiumMap from "./CesiumMap";
import NavHeader from "./NavHeader";
import NavDrawer from "./NavDrawer";
import ResultsModal from "./ResultsModal";

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
export type TPolygons = Map<string, number[]>

export interface IShapeState {
    points: number[];
    polygons: TPolygons;
    polygonEdit: number[];
    newEditPoint: boolean;
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

export default function MainWindow(this: any) {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [createPolygon, setCreatePolygon] = React.useState(false);
    // const [newEditPoint, setNewEditPoint] = React.useState(true);

    const [shapeState, setShapeState] = React.useState<IShapeState>({
        points: [],
        polygons: new Map<string, number[]>(),
        polygonEdit: [],
        newEditPoint: true,
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
        console.log(startDate, endDate);
        if (isValidDate(startDate) && isValidDate(endDate)) {
            let startTime = startDate!.setHours(0, 0, 0)
            let endTime = endDate!.setHours(23, 59, 59)
            if (endTime - startTime < 3 * 24 * 60 * 60 * 1000) {
                fetch(`/query?startDate=${encodeURIComponent(startTime)}&endDate=${encodeURIComponent(endTime)}`)
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
            polygonEdit: [...prevState.points, longitude, latitude],
            newEditPoint: true
        }))
    }

    const addPolygon = () => {
        setCreatePolygon(false);
        setShapeState(prevState => ({
            ...prevState,
            points: [],
            polygons: new Map<string, number[]>(prevState.polygons.set("Polygon" + prevState.counter, prevState.points)),
            polygonEdit: [],
            counter: prevState.counter+1
        }))
    }

    const modifyPolygon = (longitude: number, latitude: number) => {
        //potential sync issues?
        let newPolygonEdit = [...shapeState.polygonEdit];
        if (shapeState.newEditPoint) {
            //add new point
            newPolygonEdit.push(longitude, latitude);
        } else {
            //edit last point
            newPolygonEdit[newPolygonEdit.length - 2] = longitude;
            newPolygonEdit[newPolygonEdit.length - 1] = latitude;
        }
        setShapeState(prevState => ({
            ...prevState,
            polygonEdit: newPolygonEdit,
            newEditPoint: false
        }))
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <NavHeader open={drawerOpen} onMenuClick={handleDrawerOpen} onSendClick={queryBackend} startDate={startDate}
                       onStartDateChange={handleStartDateChange} endDate={endDate}
                       onEndDateChange={handleEndDateChange}/>
            <NavDrawer open={drawerOpen} createPolygon={createPolygon} onIconClick={handleDrawerClose}
                       onPolygonOptionClick={handlePolygonOptionClick}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: drawerOpen,
                })}
            >
                <div className={classes.drawerHeader}/>
                <CesiumMap addPoint={addPoint} addPolygon={addPolygon} isCreatePolygon={createPolygon}
                           isNewEditPoint={shapeState.newEditPoint} modifyPolygon={modifyPolygon}
                           points={shapeState.points} polygonEdit={shapeState.polygonEdit}
                           polygons={shapeState.polygons}/>
                <ResultsModal events={resultState.events} handleClose={handleModalClose} open={modalOpen}/>
            </main>
        </div>
    );
}

