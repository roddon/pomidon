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
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage} from 'helpers';
import { Facebook as FacebookIcon, Google as GoogleIcon } from 'icons';
import * as qs from 'query-string';

const useStyles = makeStyles(theme => ({
  root : {
    display : 'flex',
    justifyContent: 'center',
    alignItems : 'center',
    height : '100%',
    padding : '30px'
  }
}));

const AccountStatus = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    values: {},
  });

  const [pageLoaded, setPageLoad] = useState(false);
  const [account_status, setAccountStatus] = useState('Under Review');
  const [username, setUserName] = useState('');

  useEffect(() => {
    get_auth_status();
  }, []);
  

  const get_auth_status = async () => {
    let auth_status = await _auth_check.get_auth_status(document.location.href, document.location.search);

    if(auth_status == 'not_registered')
    {
        document.location.href = '/app_download';
    }
    else if (auth_status == 'not_found')
    {
       document.location.href = '/register';
    }
    else if (auth_status == 'under_review')
    {
      const parsed = qs.parse(document.location.search);
      if(parsed.token != null)
      {
        let user_name = _crypto.get_decrypt(parsed.token);
        setUserName(user_name);
      }
      else
      {
        let token = _localStorage.getItem('token');
        let user_name = _crypto.get_decrypt(token);
        setUserName(user_name);
      }
      setPageLoad(true);
      setAccountStatus('under_review');
    }
    else if (auth_status == 'blocked')
    {
      setPageLoad(true);
      setAccountStatus('blocked');
    }
    else if (auth_status == 'verified')
    {
      setPageLoad(true);
      setAccountStatus('verified');
    }
  }

  return (
    (
      pageLoaded == false ?
      <PageLoading />
      :
      <div className={classes.root}>
        {
          account_status == 'blocked' ?
          <div style = {{textAlign : 'center'}}>
              <img src = "/images/icons/blocked.png" style = {{width : 256, height : 256}}/>
              <h4 style = {{marginTop : '20px'}}>Your account was blocked. You can not access to our MES portal.</h4>
          </div>
          :
          null
        }
        {
          account_status == 'under_review' ?
          <div style = {{textAlign : 'center'}}>
              <img src = "/images/icons/under_review.png" style = {{width : 256, height : 256}}/>
              <h4 style = {{marginTop : '20px'}}>Your account is currently under review by our MES team.<br/> 
                You cannot access the MES portal until your account is verified. </h4>
              <h4 style = {{marginTop : '20px'}}>Account username under review - {username}</h4>
          </div>
          :
          null
        }
        {
          account_status == 'verified' ?
          <div style = {{textAlign : 'center'}}>
              <img src = "/images/icons/verified.png" style = {{width : 256, height : 256}}/>
              <h4 style = {{marginBottom : '40px', marginTop : '15px'}}>Your account was verified. You can access to our MES portal.</h4>
              <a href = "/" style = {{textDecorationLine : 'underline', paddingBottom : '10px'}}>visit to Mes portal.</a>
          </div>
          :
          null
        }
      </div>
    )
  );
};

AccountStatus.propTypes = {
  history: PropTypes.object
};

export default withRouter(AccountStatus);
