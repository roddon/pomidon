import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import LabelImportant from '@material-ui/icons/LabelImportant';
import {_sessionStorage} from 'helpers';
import SettingMenu from './Components/SettingMenu';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none',

    position: 'inherit !important',
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const { className,cur_page, open, onSidebarOpen, onCreateNewWorkSpace, onDeleteWorkSpace, workspaces,cur_workspace,cur_project, ...rest } = props;

  const classes = useStyles();

  const [notifications] = useState([]);
  let registered_user = _sessionStorage.getItem('user');
  let cur_module = _sessionStorage.getItem('cur_module');

  const onSignout = () => {
    window.location.href = 'sign-in';
  }

  return (
    <AppBar
      {...rest}
      variant = 'elevation'
      style = {{backgroundColor : '#fff', minHeight : '48px !important', maxHeight : '54px'}}
      className={clsx(classes.root, className)}
    >
      <Toolbar style = {{backgroundColor : '#fff', minHeight : '48px', color : '#000'}}>
        {
            <MenuIcon onClick = {onSidebarOpen} style = {{display : open == false ? 'block' : 'none', marginRight : '8px'}} />
        }
        <div style = {{display : 'flex', alignItems : 'center'}}>
          <LabelImportant style = {{fontSize : '18px', marginRight : 4}} />
          {
            cur_page == 'Project Page' && cur_project != null ?
            cur_project.name
            :
            cur_page
          }
          - {cur_workspace != null ? cur_workspace.name : 'no workspace'}
        </div>
        <div className={classes.flexGrow} />
        {/* <IconButton
          className={classes.signOutButton}
          color="inherit"
          // onClick= {() => onSignout()}
        >
          <SettingsApplicationsIcon />
        </IconButton> */}
        <SettingMenu onCreateNewWorkSpace = {onCreateNewWorkSpace} onDeleteWorkSpace = {onDeleteWorkSpace} workspaces = {workspaces} cur_workspace = {cur_workspace}/>
        {/* <Hidden mdDown>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick= {() => onSignout()}
          >
            <InputIcon />
          </IconButton>
        </Hidden> */}
        {/* <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden> */}
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
