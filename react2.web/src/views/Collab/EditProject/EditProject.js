import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Divider, Button, TextField } from '@material-ui/core';
import {AssignmentTurnedIn, AddCircle, ListAlt, Equalizer, Event, ArrowBack} from '@material-ui/icons';
import Radio from '@material-ui/core/Radio';
import {_sessionStorage, _http} from 'helpers';
import {LoadingButton, PageLoading} from 'components'
import * as qs from 'query-string';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  textField: {
    // marginTop: theme.spacing(2),
  },
  radio_wrap : {
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center',
    margin: '12px'
  }
}));

const EditProject = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [project_detail, setProjectDetail] = useState('');
  let registered_user = _sessionStorage.getItem('user');
  const [formState, setFormState] = useState({
    values: {
      default_view : 'list',
      due_date : new Date().toISOString().replace("Z", "")
    }
  });

  useEffect(() => {
    getProjectDetail();
  }, []);

  const getProjectDetail = () => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    let projectId = parsed.pr;
    if(registered_user.id == null)
    {
      alert('user is not set');
      return;
    }
    if(workspaceId == null)
    {
      alert('Workspace is not set');
      return;
    }
    if(projectId == null)
    {
      alert('project is not set');
      return;
    }
    setLoading(true);  
    _http.doPost('collab/get_project_detail', 
      { 
        user_id : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId
      }, 
      (data) => {
        if(data.status == false)
        {
          setLoading(false);  
        }
        else
        {
          setLoading(false);  
          setFormState({values : {default_view : data.data.default_view, name : data.data.name, 
              description : data.data.description, due_date : data.data.due_date}});
        }
      },
      (err) => {
        setLoading(false);
        setStatus('Error occured');
      }
    );
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

  const doEditProject = () => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    let projectId = parsed.pr;
    if(registered_user.id == null)
    {
      alert('user is not set');
      return;
    }
    if(workspaceId == null)
    {
      alert('Workspace is not set');
      return;
    }
    if(projectId == null)
    {
      alert('project is not set');
      return;
    }

    setLoading(true);  
    _http.doPost('collab/update_project', 
      { 
        user_id : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        name : formState.values.name,
        description : formState.values.description,
        default_view : formState.values.default_view,
        due_date : formState.values.due_date
      }, 
      (data) => {
        if(data.status == false)
        {
          setLoading(false);  
          setStatus('Edit project failed');
        }
        else
        {
          setLoading(false);  
          setStatus('Edit project success!');
        }
      },
      (err) => {
        setLoading(false);
        setStatus('Error occured');
      }
    );

  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={2}
        style = {{justifyContent : 'center'}}
      >
        <Grid container row item md = {9} xs={12} spacing={3} style = {{marginTop : '30px', justifyContent : 'center'}}>
          <Grid item item md = {9} xs={12}>
            <h3 style = {{marginLeft : 8, fontWeight : 'bold'}}>Edit project details</h3>
            <p style = {{color : '#f00', marginLeft : 8}}>{status}</p>
          </Grid>
          <Grid item item md = {9} xs={12}>
              <TextField
                    className={classes.textField}
                    fullWidth
                    required = {true}
                    label="Project name"
                    name="name"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.name || ''}
                    variant="outlined"
                  />
          </Grid>
          <Grid item item md = {9} xs={12}>
            <TextField
                    className={classes.textField}
                    style = {{marginBottom : '10px',}} 
                    fullWidth
                    multiline = {true}
                    rows={6}
                    required = {true}
                    label="Add a Description"
                    name="description"
                    onChange={handleChange}
                    type="text"
                    value={formState.values.description || ''}
                    variant="outlined"
                  />
          </Grid>
          <Grid item item md = {9} xs={12} style = {{display : 'flex', alignItems : 'center'}}>
            <div> Due date </div>
            <div >
              <TextField
                id="datetime-local"
                // label="Next appointment"
                type="datetime-local"
                defaultValue= {formState.values.due_date}   // "2017-05-24T10:30"
                className={classes.textField} 
                InputLabelProps={{
                  shrink: true,
                }}
                name = "due_date"
                onChange={handleChange}
                style = {{marginLeft: '22px'}}
              />
            </div>
          </Grid>
          <Grid item item md = {9} xs={12}>
            <div> Default Veiw </div>
            <div style = {{display : 'flex', flexDirection : 'row'}}>
              <div className = {classes.radio_wrap}> 
                <Radio
                    checked={formState.values.default_view === 'list'}
                    onChange={handleChange}
                    value="list"
                    name="default_view"
                  />
                <ListAlt />
                List
              </div>
              <div className = {classes.radio_wrap}>
                <Radio
                    checked={formState.values.default_view === 'board'}
                    onChange={handleChange}
                    value="board"
                    name="default_view"
                  />
                <Equalizer />
                Board
              </div> 
              <div className = {classes.radio_wrap}>
                <Radio
                    checked={formState.values.default_view === 'calendar'}
                    onChange={handleChange}
                    value="calendar"
                    name="default_view"
                  />
                <Event />
                Calendar
              </div>
            </div>
          </Grid>
          <Grid item item md = {9} xs={12} style = {{display : 'flex'}}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<ArrowBack />}
              onClick = {() => window.history.back()}
            >
              Back
            </Button>
            <LoadingButton  
               label = "Save" label_loading = "Save" loading = {loading} onClick = {doEditProject}
               style = {{minWidth : '200px', marginLeft : '20px'}}
               /> 
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditProject;
