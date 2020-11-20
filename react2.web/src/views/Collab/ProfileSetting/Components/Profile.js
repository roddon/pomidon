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
  policy: {
    presence: { allowEmpty: false, message: 'is required' },
    checked: true
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    height: '100%',
    paddingLeft: 100,
    paddingRight: 100,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
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
    paddingBottom: 35,
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

const Profile = props => {
  const { history } = props;

  const classes = useStyles();
  const [formState, setFormState] = useState({
    isValid: false,
    values: { },
    touched: {},
    errors: {}
  });
  const [user_id, setUserId] = useState(null);
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
    setCurrentProfileData();
  }, []);

  const get_auth_status = async () => {
    setPageLoad(true);
  }

  const setCurrentProfileData = () => {
    let registered_user = _sessionStorage.getItem('user');
    setUserId(registered_user.id);
    setAvatarImg(registered_user.photo.original);
    setFormState({
      values :{
        firstName : registered_user.first_name, 
        lastName : registered_user.last_name, 
        email : registered_user.email,
        phone : registered_user.phone,
        office : registered_user.office,
        department : registered_user.department,
        company : registered_user.company,
      }
    });
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



  const  onSubmit = (event) => {
   
      if(formState.values.email ==  null || formState.values.phone ==  null || formState.values.office ==  null  || 
        formState.values.office ==  null  || formState.values.department ==  null  ||
        formState.values.company ==  null )
      {
        return;
      }
  
      setLoading(true);
      let body = { 
        user_id : user_id,
        first_name : formState.values.firstName, 
        last_name : formState.values.lastName, 
        email : formState.values.email,
        phone : formState.values.phone,
        office : formState.values.office,
        department : formState.values.department,
        company : formState.values.company,
      }
      if(avatar_img.split(",").length > 1)
      {
        body.base64Image = avatar_img.split(",")[1];
      }
      _http.doPost('auth/update_user', 
        body, 
        (data) => {
          setLoading(false);
          _sessionStorage.setItem('user', data.data);
          alert('Your profile is updated successfully.')
          document.location.reload();
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
          item
          lg={12}
          md = {12}
          sm = {12}
          style = {{display : 'flex', justifyContent : 'center', alignItems : 'flex-end', padding : '20px'}}
        >
           <Avatar
                alt="Person"
                className={classes.avatar}
                // component={RouterLink}
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
            style = {{height: 'fit-content'}}
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
        <Grid
          className={classes.content}
          item
          lg={12}
          md = {12}
          sm = {12}
          xs={12}
        >
          <Grid container style = {{justifyContent : 'center'}}>
            <Grid item lg={6}  md = {6} sm = {6}  xs={12}  style = {{paddingLeft : '20px', paddingRight : '20px'}}>
              <TextField
                  className={classes.textField}
                  fullWidth
                  helperText={null}
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.firstName || ''}
                  variant="outlined"
                />
            </Grid>
            <Grid item lg={6}  md = {6} sm = {6}  xs={12} style = {{paddingLeft : '20px', paddingRight : '20px'}}>
              <TextField
                  className={classes.textField}
                  fullWidth
                  label="Last name"
                  name="lastName"
                  required = {true}
                  onChange={handleChange}
                  type="text"
                  value={formState.values.lastName || ''}
                  variant="outlined"
                />
            </Grid>
          </Grid>
          <Grid container style = {{justifyContent : 'center'}} >
            <Grid item lg={6}  md = {6} sm = {6}  xs={12} style = {{paddingLeft : '20px', paddingRight : '20px'}}>
              <TextField
                  className={classes.textField}
                  fullWidth
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  required = {true}
                  value={formState.values.email || ''}
                  variant="outlined"
                />
            </Grid>
            <Grid item lg={6}  md = {6} sm = {6}  xs={12} style = {{paddingLeft : '20px', paddingRight : '20px'}}>
              <TextField
                  className={classes.textField}
                  fullWidth
                  label="Phone"
                  name="phone"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.phone || ''}
                  variant="outlined"
                />
            </Grid>
          </Grid>
          <Grid container style = {{justifyContent : 'center'}} >
            <Grid item lg={6}  md = {6} sm = {6}  xs={12} style = {{paddingLeft : '20px', paddingRight : '20px'}}>
              <TextField
                  className={classes.textField}
                  fullWidth
                  label="Company"
                  name="company"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.company || ''}
                  variant="outlined"
                />
            </Grid>
            <Grid item lg={6}  md = {6} sm = {6}  xs={12} style = {{paddingLeft : '20px', paddingRight : '20px'}}>
              <TextField
                  className={classes.textField}
                  fullWidth
                  label="Office"
                  name="office"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.office  || ''}
                  variant="outlined"
                />
            </Grid>
          </Grid>
          <Grid container style = {{justifyContent : 'center'}} >
            <Grid item lg={6}  md = {6} sm = {6}  xs={12} style = {{paddingLeft : '20px', paddingRight : '20px'}}>
              <TextField
                  className={classes.textField}
                  fullWidth
                  label="Department"
                  name="department"
                  onChange={handleChange}
                  type="text"
                  required = {true}
                  value={formState.values.department || ''}
                  variant="outlined"
                />
            </Grid>
            <Grid item lg={6}  md = {6} sm = {6}  xs={12} >
            </Grid>
          </Grid>
          <div style = {{marginTop : '10px', textAlign : 'center'}} >
            <LoadingButton label = "Update" label_loading = "Update" loading = {loading} onClick = {onSubmit}/>
          </div>
        </Grid>
      </Grid>
    </div>
    )
  );
};

Profile.propTypes = {
  history: PropTypes.object
};

export default withRouter(Profile);
