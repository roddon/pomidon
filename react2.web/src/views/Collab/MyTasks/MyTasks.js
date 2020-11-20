import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Divider, Button } from '@material-ui/core';
import {AssignmentTurnedIn, AddCircle} from '@material-ui/icons'
import InvitedProjectsTable from './Components/InvitedProjectsTable';
import MyProjectsTable from './Components/MyProjectsTable';
import {_url_helper, _sessionStorage} from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const MyTasks = () => {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={2}
        style = {{justifyContent : 'center'}}
      >
        <Grid container row item md = {9} xs={12} spacing={3} style = {{marginTop : '30px'}}>
          <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center'}}>
            <AssignmentTurnedIn style = {{fontSize : 16}}/> 
            <p style = {{marginLeft : 8, fontSize : 16, fontWeight : 'bold'}}>Invited Projects</p></div>
            <div style={{flex : 1}} />
          <Divider style = {{backgroundColor : '#00000047', marginTop : 10, width : '100%'}}/>
          {/* <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center',width : '100%', }}>
            <p style = {{marginLeft : 8, fontSize : 14, width : '100%', textAlign : 'center'}}>No invited projects</p>
          </div> */}
          <InvitedProjectsTable projects = {[{name : 'test invite project 1', owner : 'test@user.com'}]} />
        </Grid>
        <Grid container row item md = {9} xs={12} spacing={3} style = {{marginTop : '30px'}}>
          <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%'}}>
            <AssignmentTurnedIn style = {{fontSize : 16}}/> 
            <p style = {{marginLeft : 8, fontSize : 16, fontWeight : 'bold'}}>My Projects</p>
            <div style={{flex : 1}} />
            <Button
              color='#151b26'
              variant="outlined"
              style = {{paddingLeft : '8px', paddingRight : '8px', minWidth: 'auto'}}
              onClick = {() => {_url_helper.goToPage(document.location.href, '/collab_addproject')}}
            >
              <AddCircle style = {{width : 20, height : 20}}/>
            </Button>
          </div>
          <Divider style = {{backgroundColor : '#00000047', marginTop : 10, width : '100%'}}/>
          {/* <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', }}>
            <p style = {{marginLeft : 8, fontSize : 14,width : '100%', textAlign : 'center'}}>No Recent projects</p>
          </div> */}
          <MyProjectsTable  />
        </Grid>
      </Grid>
    </div>
  );
};

export default MyTasks;
