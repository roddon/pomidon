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

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/system/bg.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 'bold',
    fontSize: 'xxx-large',
    lineHeight : '85px'
  },
  name: {
    marginTop: theme.spacing(3),
    color: '#fff',
    fontSize : 'large'
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

const Notification = props => {
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  const [loading, setLoading] = useState(false);
  const [pageLoaded, setPageLoad] = useState(false);
  const [signin_status, setStatus] = useState('');

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));

    get_auth_status();
    
  }, [formState.values]);

  const get_auth_status = () => {

    setPageLoad(true);
  }
  
  const handleBack = () => {
    history.goBack();
  };

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };


  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

    
  const  onSubmit = () => {
    if(formState.errors['email'] || formState.values.password ==  null || formState.values.password ==  '')
    {
      return;
    }
    setLoading(true);
    _http.doPost('auth/login', 
      { 
        email : formState.values.email,
        pass : formState.values.password
      }, 
      (data) => {
        if(data.status == false)
        {
          console.log('Login failed');
          setLoading(false);  
          // alert('Login failed');
          setStatus('Login failed');
        }
        else
        {
          setLoading(false);  
          // setStatus('Login success!');
          _sessionStorage.setItem('user', data.data);
          history.push('/collab_dashboard');
        }
      },
      (err) => {
        setLoading(false);
        console.log('Error occured', err);
        // alert('Error occured', err);
        setStatus('Error occured');
      }
    );
  }

  return (
    (
      pageLoaded == false ?
      <PageLoading />
      :
      <div className={classes.root}>
        <Grid
          className={classes.grid}
          container
        >
          Notification
        </Grid>
      </div>
    )
  );
};

Notification.propTypes = {
  history: PropTypes.object
};

export default withRouter(Notification);
