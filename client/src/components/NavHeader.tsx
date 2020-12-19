import React from "react";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from "clsx";
import {Send} from "@material-ui/icons";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        dateInput: {
            color: 'white'
        }
    }),
);

type NavHeaderProps = {
    open: boolean;
    onMenuClick: () => void;
    onSendClick: () => void;
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    sendDisabled: boolean;
}

export default function NavHeader(props: NavHeaderProps) {
    const classes = useStyles();
    return (
        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: props.open,
            })}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={props.onMenuClick}
                    edge="start"
                    className={clsx(classes.menuButton, props.open && classes.hide)}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" className={classes.title} noWrap>
                    Resium App
                </Typography>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        variant="inline"
                        ampm={false}
                        value={props.startDate}
                        onChange={props.onStartDateChange}
                        label="Start Date"
                        InputProps={{className: classes.dateInput}}
                        InputLabelProps={{className: classes.dateInput}}
                    />
                    <DateTimePicker
                        variant="inline"
                        ampm={false}
                        value={props.endDate}
                        onChange={props.onEndDateChange}
                        label="End Date"
                        InputProps={{className: classes.dateInput}}
                        InputLabelProps={{className: classes.dateInput}}
                    />
                </MuiPickersUtilsProvider>
                <IconButton color="inherit" aria-label="send" onClick={props.onSendClick} disabled={props.sendDisabled}>
                    <Send/>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

