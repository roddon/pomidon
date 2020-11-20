import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import Edit from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import PersonIcon from '@material-ui/icons/Person';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { Divider } from '@material-ui/core';
import {_url_helper} from 'helpers';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      // backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        // color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);


export default function MenuButton(props) {
  const {onEdit, onDel, btn_style, ...rest} = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  
  const onEditBtnClick = (e) => {
    setAnchorEl(null);
    onEdit(e);
  }

  const onDeleteBtnClick = (e) => {
    setAnchorEl(null);
    onDel(e);
  }

  return (
    <div>
      <IconButton style = {{padding : 5}} 
        aria-controls="customized-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
          <MoreHoriz style= {{fontSize : 20}}/>
        </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick = {onEditBtnClick}>
          <ListItemIcon style = {{minWidth : 22}}>
            <Edit style = {{fontSize : 16}} />
          </ListItemIcon>
          <ListItemText primary = {"Update " + btn_style} />
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem onClick = {onDeleteBtnClick}>
          <ListItemIcon style = {{minWidth : 22}}>
            <DeleteOutlineIcon style = {{fontSize : 16}}/>
          </ListItemIcon>
          <ListItemText primary = {"Delete " + btn_style} />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}