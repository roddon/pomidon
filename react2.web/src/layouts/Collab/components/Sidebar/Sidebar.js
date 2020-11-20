import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer, ButtonBase } from '@material-ui/core';
// import DashboardIcon from '@material-ui/icons/Dashboard';
import {Dashboard as DashboardIcon, MenuOpenSharp as MenuOpenIcon, AssignmentTurnedIn as AssignmentTurnedInIcon, NotificationsActive as NotificationsActiveIcon} from '@material-ui/icons';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import ChatIcon from '@material-ui/icons/Chat';
import CategoryIcon from '@material-ui/icons/Category';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import { Profile, SidebarNav, UpgradePlan, WorkspaceNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    color : '#fff !important' 
    // [theme.breakpoints.up('lg')]: {
    //   marginTop: 64,
    //   height: 'calc(100% - 64px)'
    // }
  },
  root: {
    backgroundColor: '#151b26',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: 0
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className,cur_workspace, projects,onSelectProject, ...rest } = props;

  const classes = useStyles();
 
  const pages = [
    {
      title: 'Dashboard',
      href: '/collab_dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'My Projects',
      href: '/collab_mytasks',
      icon: <AssignmentTurnedInIcon />
    },
    {
      title: 'Inbox',
      href: '/collab_inbox',
      icon: <NotificationsActiveIcon />
    },
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div style = {{display : 'inline-flex', marginBottom: '28px', alignItems: 'center'}}>
          <img
            alt="Logo"
            src="/images/system/logo.png"
            width = "22"
            height = "25"
          />
          <p style = {{marginLeft : 6, color : '#fff', fontSize : 16, fontWeight : 'bold'}}>{props.cur_module}</p>
          <span style = {{flex : 1}}></span>
          <ButtonBase onClick = {() => onClose()}><MenuOpenIcon style = {{color : '#fff', fontSize : '30px', cursor : 'pointer'}} /></ButtonBase>
        </div>  
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        <Divider className={classes.divider} />
        <WorkspaceNav className={classes.nav} cur_workspace = {cur_workspace} projects = {projects} onSelectProject = {onSelectProject}/>
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
