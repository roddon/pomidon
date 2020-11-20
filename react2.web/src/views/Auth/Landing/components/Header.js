import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
} from '@material-ui/core';
import {_sessionStorage} from 'helpers';

const useStyles = makeStyles(theme => ({
  logoContainer : {display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center'},
  logoImage: {
    [theme.breakpoints.down('sm')]: {
      width : '40px'
    },
    width : '150px',
  },
  logoTxt: {paddingTop : 5, color : '#fff', 
    [theme.breakpoints.down('sm')]: {
      fontSize : '8px'
    },
    fontSize : '18px', fontWeight : 'bold'},

}));

const Header = props => {
  const { history } = props;

  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
  }, []);
  

  return (
      <div style = {{display : 'inline-flex', padding : '20px', width : '100%', position : 'absolute', top : 0, zIndex : 100}}>
          <div className={classes.logoContainer}>
            <img
              alt="Logo"
              src="/images/system/logo.png"
              className = {classes.logoImage}
            />
            <p className = {classes.logoTxt}>Klipspruit Colliery</p>
          </div>
          <div style = {{flex : 1}} />
          {
            registered_user == null ?
              <Button
                style = {{backgroundColor : '#eada23', textTransform: 'none', height: 'fit-content'}} 
                  variant = 'contained'
                  autoCapitalize = {false}
                  onClick = {props.onRequesAccess}
                >
                Request access
              </Button>
              :
            <div style = {{color : '#eada23'}}>Welcome {registered_user.first_name} {registered_user.last_name}!</div>
          }
          
      </div>
  );
};

Header.propTypes = {
  history: PropTypes.object
};

export default withRouter(Header);
