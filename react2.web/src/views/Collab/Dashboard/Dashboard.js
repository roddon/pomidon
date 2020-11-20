import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Divider } from '@material-ui/core';
import {AssignmentTurnedIn} from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
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
            <p style = {{marginLeft : 8, fontSize : 16, fontWeight : 'bold'}}>Projects due soon</p></div>
            <div style={{flex : 1}} />
            <a href = '/' style = {{marginLeft : 8, fontSize : 16, fontWeight : 'bold'}}>see all my tasks</a>
          <Divider style = {{backgroundColor : '#00000047', marginTop : 10, width : '100%'}}/>
          <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center',width : '100%', }}>
            <p style = {{marginLeft : 8, fontSize : 14, width : '100%', textAlign : 'center'}}>No Recent projects</p>
          </div>
        </Grid>
        <Grid container row item md = {9} xs={12} spacing={3} style = {{marginTop : '30px'}}>
          <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center'}}>
            <AssignmentTurnedIn style = {{fontSize : 16}}/> 
            <p style = {{marginLeft : 8, fontSize : 16, fontWeight : 'bold'}}>Recent projects</p>
          </div>
          <Divider style = {{backgroundColor : '#00000047', marginTop : 10, width : '100%'}}/>
          <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', }}>
            <p style = {{marginLeft : 8, fontSize : 14,width : '100%', textAlign : 'center'}}>No Recent projects</p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
