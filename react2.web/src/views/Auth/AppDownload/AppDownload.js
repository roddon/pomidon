import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {LoadingButton, PageLoading} from 'components'
import {config, _http, _sessionStorage, _auth_check} from 'helpers';
import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons';

const useStyles = makeStyles(theme => ({
  root : {
    display : 'flex',
    justifyContent: 'center',
    alignItems : 'center',
    height : '100%',
    padding : '30px'
  }
}));

const AppDownload = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    values: {},
  });

  const [pageLoaded, setPageLoad] = useState(false);
  const [account_status, setAccountStatus] = useState('Under Review');

  useEffect(() => {
    get_auth_status();
  }, []);
  

  const get_auth_status = async () => {
    let auth_status = await _auth_check.get_auth_status(document.location.href, document.location.search);
    if(auth_status == 'not_registered')
    {
      setPageLoad(true);
    }
    else if (auth_status == 'not_found')
    {
       document.location.href = '/register';
    }
    else if (auth_status == 'under_review')
    {
      setAccountStatus('under_review');
      document.location.href = '/account_status';
    }
    else if (auth_status == 'blocked')
    {
      setAccountStatus('blocked');
      document.location.href = '/account_status';
    }
    else if (auth_status == 'verified')
    {
      setAccountStatus('verified');
      document.location.href = '/';
    }
  }

  return (
    (
      pageLoaded == false ?
      <PageLoading />
      :
      <div className={classes.root}>
         <div style = {{textAlign : 'center'}}>
              <img src = "/images/icons/users.png" style = {{width : 256, height : 256}}/>
              <h4 style = {{marginTop : '20px'}}>Please download this application to access to our MES.</h4>
              <a href = "/app/loginTokenApp_remote.exe" style = {{textDecorationLine : 'underline', paddingBottom : '10px'}}>loginTokenApp_remote.exe</a> 
          </div>
      </div>
    )
  );
};

AppDownload.propTypes = {
  history: PropTypes.object
};

export default withRouter(AppDownload);
