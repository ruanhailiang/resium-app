import React, {useEffect} from "react";
import {createStyles, makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import clsx from "clsx";
import CesiumMap from "./CesiumMap";
import NavHeader from "./NavHeader";
import NavDrawer from "./NavDrawer";
import {Math} from "cesium";

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
        },
    }),
);

export interface IShapeState {
    points: Array<number>;
    polygons: Array<Array<number>>;
    polygonEdit: Array<number>;
    newEditPoint: boolean;
}

export default function MainWindow(this: any) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [createPolygon, setCreatePolygon] = React.useState(false);
    // const [newEditPoint, setNewEditPoint] = React.useState(true);

    const [shapeState, setShapeState] = React.useState<IShapeState>({
        points: [],
        polygons: [],
        polygonEdit: [],
        newEditPoint: true
    });

    useEffect(() => {
        fetch('/users')
            .then(res => res.json())
            .then(users => console.log(users));
    });

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
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
            polygons: [...prevState.polygons, prevState.points],
            polygonEdit: []
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
            <NavHeader open={open} onClick={handleDrawerOpen}/>
            <NavDrawer open={open} createPolygon={createPolygon} onIconClick={handleDrawerClose}
                       onPolygonOptionClick={handlePolygonOptionClick}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader}/>
                <CesiumMap addPoint={addPoint} addPolygon={addPolygon} isCreatePolygon={createPolygon}
                           isNewEditPoint={shapeState.newEditPoint} modifyPolygon={modifyPolygon}
                           points={shapeState.points} polygonEdit={shapeState.polygonEdit} polygons={shapeState.polygons}/>
            </main>
        </div>
    );
}

