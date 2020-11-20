import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import {_sessionStorage} from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const { className, onSidebarOpen, ...rest } = props;

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
      className={clsx(classes.root, className)}
    >
      <Toolbar>
      {/* to="/" */}
        <RouterLink>
          <div style = {{display : 'inline-flex'}}>
            <img
              alt="Logo"
              src="/images/system/logo.png"
              width = "33"
              height = "33"
            />
            
            <p style = {{marginLeft : 6, paddingTop : 5, color : '#fff', fontWeight : 'bold'}}>{props.cur_module}</p>
          </div>  
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          {/* <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick= {() => onSignout()}
          >
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
