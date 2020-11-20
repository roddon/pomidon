import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography   
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';

const useStyles = makeStyles(theme => ({
  container : {display : 'flex', flexDirection : 'column', justifyContent : 'center', alignItems : 'center', width : '100%'},
  top: {height : '300px',width : '100%',},
  bottom: { minHeight : '340px',width : '100%',  backgroundColor : '#000', 
    borderRadius: '150em / 10em',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  bottomMenu: {width : '100%',  backgroundColor : '#000', 
    marginTop : '40px', marginBottom : '40px'
  },
  log_query : {
    [theme.breakpoints.down('sm')]: {
      width : '90vw'
    },
    width : '50vw',
    marginTop : '-200px',
    // position: 'absolute',
    // top : '20vh',
  },
  log_query_card : {
    [theme.breakpoints.down('sm')]: {
      width : '90vw'
    },
    width : '50vw',
    backgroundColor : '#54585A',
  },
  log_query_head : {
    color : '#ECDE3F',
    marginBottom : '20px',
    marginTop: theme.spacing(2),
  },
  log_query_txt : {
    color : '#fff',
    
  },
  textField: {
    marginTop: theme.spacing(2),
    backgroundColor: '#00000022',
  },
  textFiled_input : {
    color : '#eee',
    '&::placeholder': {
      textOverflow: 'ellipsis !important',
      color: '#f00'
    }
  },
  input : {
    backgroundColor: '#00000022',
    marginTop: theme.spacing(2),
    width : '100%',
    borderWidth : 0,
    borderRadius: '5px',
    height: '48px',
    padding: '8px',
    color: '#aaa'
  },
  textArea : {
    backgroundColor: '#00000022',
    marginTop: theme.spacing(2),
    width : '100%',
    height : '160px',
    padding : '10px',
    color: '#aaa'
  },
  button : {marginTop: theme.spacing(2), backgroundColor : '#ECDE3F', textTransform: 'none', height: 'fit-content', borderRadius : '20px', float: 'right'},

}));

const Footer = props => {
  const { history } = props;

  
  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  
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


  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  }, []);
  

  return (
    <div className={classes.container}>
      <div className={classes.container}>
        <div className={classes.top}>
        </div>
       
        <div className={classes.bottom}>
        <Grid
          className={classes.log_query}
          container
        >
          <Grid
            
            item
            xl = {12}
            lg={12}
            md= {12}
            sm = {12}
          > 
            <Card className= {classes.log_query_card}>
              <CardContent>
                  <Grid
                    container
                    style = {{padding : '20px'}}
                  >
                    <Grid
                      item xl ={4} lg = {4} md = {4} sm = {4} xs = {12}
                    >
                      <Typography variant = 'h2' className = {classes.log_query_head}>
                        Log a query
                      </Typography>
                      <Typography variant = 'body2' className = {classes.log_query_txt}>
                        If the path is beautiful, let us not ask where it leads. my religion is very simple. my religion is kindness.
                      </Typography>
                    </Grid>
                    <Grid
                      item xl ={8} lg = {8} md = {8} sm = {8} xs = {12}
                    >
                      <input
                        className={classes.input}
                        required = {true}
                        placeholder = 'Your full name'
                      />
                      <input
                        className={classes.input}
                        required = {true}
                        placeholder = 'Your e-mail address'
                      />
                      <textarea 
                        className={classes.textArea}
                        required = {true}
                        placeholder = 'Drop us a message here...'
                      >
                      </textarea>
                      <Button
                        className={classes.button}
                          variant = 'contained'
                          autoCapitalize = {false}
                        >
                        Send message
                      </Button>
                    </Grid>
                  </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            
            item
            xl = {12}
            lg={12}
            md= {12}
            sm = {12}
          > 
            <div className={classes.bottomMenu}>
              <Grid
                container
                style = {{padding : '20px', justifyContent: 'center'}}
              >
                <Grid
                  item xl ={4} lg = {4} md = {4} sm = {4} xs = {12}
                >
                  <Typography variant = 'h2' style = {{color : '#fff', marginBottom : '18px', marginTop : '10px'}}>
                    Klipspruit Colliery
                  </Typography>
                  <Typography variant = 'body2'  style = {{color : '#fff', marginBottom : '8px', lineHeight : '30px'}}>
                    A nice piece of information about Klipspruit 
                  </Typography>
                  <Typography variant = 'body2'  style = {{color : '#fff', lineHeight : '30px', fontSize : 16}}>
                   <EmailIcon style = {{fontSize : 16, marginRight : 5, color : '#ECDE3F'}} /> admin@south32.com
                  </Typography>
                  <Typography variant = 'body2'  style = {{color : '#fff', lineHeight : '30px', fontSize : 16}}>
                    <PhoneIcon style = {{fontSize : 16,  marginRight : 5,color : '#ECDE3F'}}/> + 12 3456 7890
                  </Typography>
                </Grid>
                <Grid
                  item xl ={4} lg = {4} md = {4} sm = {4} xs = {12}
                >
                  <Typography variant = 'h4'  style = {{color : '#fff', marginBottom : '13px', marginTop : '10px'}}>
                    Services
                  </Typography>
                  <RouterLink>
                    <Typography variant = 'body2'  style = {{color : '#fff', lineHeight : '30px'}}>
                      Log a query
                    </Typography>
                  </RouterLink>
                  <RouterLink>
                    <Typography variant = 'body2'  style = {{color : '#fff', lineHeight : '30px'}}>
                      Log a fault
                    </Typography>
                  </RouterLink>
                  <RouterLink>
                    <Typography variant = 'body2' style = {{color : '#fff', lineHeight : '30px'}}>
                      Admin login
                    </Typography>
                  </RouterLink>
                  <RouterLink>
                    <Typography variant = 'body2' style = {{color : '#fff', lineHeight : '30px'}}>
                      Track vihicles
                    </Typography>
                  </RouterLink>
                </Grid>
                <Grid
                  item xl ={4} lg = {4} md = {4} sm = {4} xs = {12}
                >
                  <Typography variant = 'h4'  style = {{color : '#fff', marginBottom : '13px', marginTop : '10px'}}>
                    Address
                  </Typography>
                  <Typography variant = 'body2'  style = {{color : '#fff', lineHeight : '30px'}}>
                    Farm Klipfontein 3,
                  </Typography>
                  <Typography variant = 'body2'  style = {{color : '#fff', lineHeight : '30px'}}>
                    Registration Division IS,
                  </Typography>
                  <Typography variant = 'body2'  style = {{color : '#fff', lineHeight : '30px'}}>
                  Ogies, South Africa, 2230
                  </Typography>
                </Grid>
              </Grid>    
            </div>
          </Grid>
        </Grid>
        </div>
      </div>
      
    </div>
  );
};

Footer.propTypes = {
  history: PropTypes.object
};

export default withRouter(Footer);
