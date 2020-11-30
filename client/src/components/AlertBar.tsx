import {Snackbar} from "@material-ui/core";
import React from "react";
import Alert, {Color} from '@material-ui/lab/Alert';


export default function AlertBar(props: { open: boolean, handleClose: () => void, severity: Color, message: string }) {

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        props.handleClose();
    };

    return (
        <div>
            <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={props.severity}>
                    {props.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
