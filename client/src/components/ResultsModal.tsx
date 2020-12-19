import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import makeStyles from "@material-ui/core/styles/makeStyles";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {TEvent} from "./MainWindow";

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        // width: 800,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    table: {
        minWidth: 400,
    },
    label: {
        textTransform: 'capitalize'
    }
}));


type ResultsModalProps = {
    open: boolean;
    handleClose: () => void;
    events: TEvent[];
}

export default function ResultsModal(props: ResultsModalProps) {
    const classes = useStyles();
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="simple-dialog-title"
            aria-describedby="simple-dialog-description"
        >
            <DialogTitle id="simple-dialog-title">Results</DialogTitle>
            <DialogContent dividers>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>Distance (km)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.events.map((event) => (
                                <TableRow key={event.time}>
                                    <TableCell component="th" scope="row">
                                        {event.time}
                                    </TableCell>
                                    <TableCell>{parseFloat(event.distance).toFixed(1)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    )
}

