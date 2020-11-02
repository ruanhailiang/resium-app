import React from 'react';
import Popover, {PopoverPosition} from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';

type SelectionMenuProps ={
    anchorPosition: PopoverPosition | undefined;
    handleClose: () => void;
    handleDelete: () => void;

}

export default function SelectionMenu(props: SelectionMenuProps ) {
    return (
        <Popover
            id="simple-menu"
            anchorReference = 'anchorPosition'
            anchorPosition={props.anchorPosition}
            keepMounted
            open={Boolean(props.anchorPosition)}
            onClose={props.handleClose}
        >
            <MenuItem onClick={props.handleDelete}>Delete</MenuItem>
        </Popover>
    )
}