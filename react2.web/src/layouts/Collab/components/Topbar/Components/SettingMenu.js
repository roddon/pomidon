import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';
import DraftsIcon from '@material-ui/icons/Drafts';
import CheckIcon from '@material-ui/icons/Check';
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


export default function SettingMenu(props) {
  const {onCreateNewWorkSpace, onDeleteWorkSpace, workspaces,cur_workspace, ...rest} = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goWorkspace = (workspace_id) => {
    document.location.href = '/collab_dashboard?ws=' + workspace_id;
  }

  return (
    <div>
      <IconButton
        //   className={classes.signOutButton}
          color="inherit"
          aria-controls="customized-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
        <SettingsApplicationsIcon />
        </IconButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {
          workspaces.map((workspace, index) => 
            <StyledMenuItem
              key = {index}
              onClick = {() => goWorkspace(workspace.id)}
              >
              <ListItemIcon>
                {
                  cur_workspace != null && cur_workspace.id == workspace.id ?
                  <CheckIcon fontSize="small" />
                  :
                  null
                } 
              </ListItemIcon>
              <ListItemText primary= {workspace.name} />
            </StyledMenuItem>
          )
        }
        <Divider />
        <StyledMenuItem  onClick = {onCreateNewWorkSpace}>
          <ListItemIcon>
            <AddCircleOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Create New Workspace" />
        </StyledMenuItem>
        <StyledMenuItem onClick = {onDeleteWorkSpace}>
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Remove this workspace" />
        </StyledMenuItem>
        <Divider />
        <StyledMenuItem  onClick = {() => {_url_helper.goToPage(document.location.href, '/collab_setting')}}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profile Setting" />
        </StyledMenuItem>
        <StyledMenuItem onClick = {() => {
            sessionStorage.removeItem('user');
            document.location.href = '/';
        }}> 
          <ListItemIcon>
            <ExitToAppOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </StyledMenuItem>
      </StyledMenu>
    </div>
  );
}