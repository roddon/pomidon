import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  FormHelperText,
  Checkbox,
  Typography,
  Select,
  InputLabel, FormControl,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage} from 'helpers';
import {LoadingButton, PageLoading} from 'components'
import * as qs from 'query-string';

const schema = {
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  phone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  office: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 100
    }
  },
  department: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 100
    }
  },
  company: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 100
    }
  },
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
  },
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
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
    overflowY: 'auto'
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
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  },
  avatar: {
    width: 120,
    height: 120
  },
  formControl: {
    minWidth: 150,
  },
}));

const SignUp = props => {
  const { history } = props;

  const classes = useStyles();
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });
  const [username, setUserName] = useState('');
  const [photo_file, setPhotoFile] = useState(null);
  const [avatar_img, setAvatarImg] = useState('/images/avatars/empty.png');
  const [avatar_form, setAvatarForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passConfirm, setPassConfirm] = useState(false);
  const [pageLoaded, setPageLoad] = useState(false);

  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));

    get_auth_status();
  }, [formState.values]);

  const get_auth_status = async () => {
    // let auth_status = await _auth_check.get_auth_status(document.location.href, document.location.search);
    // if(auth_status == 'not_registered')
    // {
    //     document.location.href = '/app_download';
    // }
    // else if (auth_status == 'not_found')
    // {
    //   const parsed = qs.parse(document.location.search);
    //   if(parsed.token != null)
    //   {
    //     let user_name = _crypto.get_decrypt(parsed.token);
    //     setUserName(user_name);
    //   }
    //   else
    //   {
    //     let token = _localStorage.getItem('token');
    //     let user_name = _crypto.get_decrypt(token);
    //     setUserName(user_name);
    //   }
    //   setPageLoad(true);
    // }
    // else if (auth_status == 'under_review')
    // {
    //     document.location.href = '/account_status';
    // }
    // else if (auth_status == 'blocked')
    // {
    //     document.location.href = '/account_status';
    // }
    // else if (auth_status == 'verified')
    // {
    //     document.location.href = '/';
    // }
    let registered_user = _sessionStorage.getItem('user');
    if(registered_user != null)
    {
       document.location.href = '/';
    }
    setPageLoad(true);
  }

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

  const _handleImageChange = (e) => {
    e.preventDefault();
    try
    {
        let reader = new FileReader();
        let file = e.target.files[0];
    
        reader.onloadend = () => {
          setAvatarForm(file);
          setAvatarImg(reader.result);
        }
        
        reader.readAsDataURL(file)
    }
    catch(err)
    {
      console.log('handle image error');
    }
  }


  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const  onSubmit = (event) => {
   
      if(formState.errors['email'] || formState.values.phone ==  null || formState.values.office ==  null  || 
        formState.values.office ==  null  || formState.values.department ==  null  ||
        formState.values.company ==  null  ||formState.values.password ==  null || formState.values.confirm_password == null)
      {
        return;
      }
      if(formState.values.password != formState.values.confirm_password)
      {

        setPassConfirm(true);
        event.preventDefault();
        return;
      }
   
      setLoading(true);
      let body = { 
        username : username,
        first_name : formState.values.firstName, 
        last_name : formState.values.lastName, 
        email : formState.values.email,
        phone : formState.values.phone,
        pass : formState.values.password,
        office : formState.values.office,
        department : formState.values.department,
        company : formState.values.company,
      }
      if(avatar_img.split(",").length > 1)
      {
        body.base64Image = avatar_img.split(",")[1];
      }
      if(formState.values.access_level == null)
      {
        body.access_level = 'Read';
      }
      _http.doPost('auth/register', 
        body, 
        (data) => {
          setLoading(false);
          _sessionStorage.setItem('user', data.data);
          // document.location.href = '/account_status';
          document.location.href = '/';
        },
        (err) => {
          setLoading(false);
          alert('Error occured');
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
        style = {{justifyContent : 'center'}}
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={6}
          md = {6}
          sm = {6}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                INFORMATION PORTAL
              </Typography>
              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  Everything Klipspruit
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={6}
          md = {6}
          sm = {6}
          xs={12}
        >
          <div className={classes.content}>
            {/* <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div> */}
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                // onSubmit={handleSignUp}
              >
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Create new account
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Use your email to create new account
                </Typography>
                <Grid
                  className={classes.grid}
                  container
                >
                  <Grid
                    style = {{display : 'flex', justifyContent : 'center', alignItems : 'flex-end'}}
                    item
                    lg={6}
                    md = {6}
                  >
                    <Avatar
                      alt="Person"
                      className={classes.avatar}
                      component={RouterLink}
                      src={avatar_img}
                      // to="/settings"
                    />
                     <input 
                      hidden = {true}
                      ref = {ref => setPhotoFile(ref)}
                      style={classes.fileInput} 
                      type="file" 
                      accept="image/*"
                      onChange={(e)=>_handleImageChange(e)} />
                    <Button
                      title = "Upload"
                      variant = "outlined"
                      onClick = {() => {
                        if(photo_file != null)
                        {
                          photo_file.click();
                        }
                      }}
                    >
                      Upload
                    </Button>
                  </Grid>
                </Grid>
                
                {/* <TextField
                  className={classes.textField}
                  fullWidth
                  label="user name"
                  name="username"
                  type="text"
                  required = {true}
                  disabled = {true}
                  value={username}
                  variant="outlined"
                /> */}
                <TextField
                  className={classes.textField}
                  error={hasError('firstName')}
                  fullWidth
                  helperText={
                    hasError('firstName') ? formState.errors.firstName[0] : null
                  }
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.firstName || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('lastName')}
                  fullWidth
                  helperText={
                    hasError('lastName') ? formState.errors.lastName[0] : null
                  }
                  label="Last name"
                  name="lastName"
                  required = {true}
                  onChange={handleChange}
                  type="text"
                  value={formState.values.lastName || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  required = {true}
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                 <TextField
                  className={classes.textField}
                  fullWidth
                  error={hasError('phone')}
                  helperText={
                    hasError('phone') ? formState.errors.phone[0] : null
                  }
                  label="Phone"
                  name="phone"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.phone || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth
                  error={hasError('company')}
                  helperText={
                    hasError('company') ? formState.errors.company[0] : null
                  }
                  label="Company"
                  name="company"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.company || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth
                  error={hasError('office')}
                  helperText={
                    hasError('office') ? formState.errors.office[0] : null
                  }
                  label="Office"
                  name="office"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.office  || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  fullWidth
                  error={hasError('department')}
                  helperText={
                    hasError('department') ? formState.errors.department[0] : null
                  }
                  label="Department"
                  name="department"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.department || ''}
                  variant="outlined"
                />
                {/* <FormControl variant="outlined" className={[classes.formControl, classes.textField].join(' ')}>
                  <InputLabel htmlFor="outlined-age-native-simple">Access Level</InputLabel>
                  <Select
                    native
                    value={formState.values.access_level}
                    onChange={handleChange}
                    label="Access Level"
                    name = "access_level"
                  >
                    <option value={10}>Read</option>
                    <option value={20}>Write</option>
                    <option value={30}>Read/Write</option>
                  </Select>
                </FormControl> */}
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  required = {true}
                  value={formState.values.password || ''}
                  variant="outlined"
                />
                 <TextField
                  className={classes.textField}
                  error={passConfirm}
                  fullWidth
                  helperText={
                    passConfirm ? 'Please confirm password' : null
                  }
                  label="Confirm password"
                  name="confirm_password"
                  onChange={handleChange}
                  type="password"
                  required = {true}
                  value={formState.values.confirm_password || ''}
                  variant="outlined"
                />
               
                {/* <div className={classes.policy}>
                  <Checkbox
                    checked={formState.values.policy || false}
                    className={classes.policyCheckbox}
                    color="primary"
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    className={classes.policyText}
                    color="textSecondary"
                    variant="body1"
                  >
                    I have read the{' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </div>
                {hasError('policy') && (
                  <FormHelperText error>
                    {formState.errors.policy[0]}
                  </FormHelperText>
                )} */}
                {/* <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign up now
                </Button> */}
                <div style = {{marginTop : '10px'}} />
                <LoadingButton label = "Sign up" label_loading = "Sign up" loading = {loading} onClick = {onSubmit}/>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  style = {{marginTop : '20px'}}
                >
                  Have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/sign-in"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
    )
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
