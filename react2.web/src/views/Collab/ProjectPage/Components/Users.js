import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  DialogTitle, Dialog, DialogActions, DialogContent, DialogContentText, 
  InputLabel, FormControl,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {GroupAdd} from '@material-ui/icons';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage, getInitials} from 'helpers';
import {LoadingButton, PageLoading} from 'components'
import * as qs from 'query-string';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    // height: '100%',
    marginBottom : 70,
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
  button: {
    paddingTop : 0,
    paddingBottom : 0,
    textTransform: "none",
  },
  avatar: {
    width: 120,
    height: 120
  },
  formControl: {
    minWidth: 150,
  },
  tablecell : {
    padding : 0,
    paddingTop : 6,
    paddingBottom : 6
  },
}));

const Users = props => {
  const { history } = props;

  const classes = useStyles();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invite_email, setInviteEmail] = useState('');
  const [invite_description, setInviteDescription] = useState('');
  const [isDialog, showDialog] = useState(false);
  const [pageLoaded, setPageLoad] = useState(false);
  const [total_members, setTotal] = useState(0);
  const [pending_members, setPending] = useState(0);
  const [users, setUsers] = useState([]);

  let invited_flag = false;
  let pathName = new URL(document.location.href).pathname;
  console.log('pathName', pathName)
  if(pathName == '/collab_invited_project')
  {
    invited_flag = true;
  }

  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
    get_auth_status();
    get_members_project();
    get_all_users();
  }, []);

  const get_auth_status = async () => {
    setPageLoad(true);
  }

  const get_all_users = () => {
   
    _http.doPost('auth/users/get', 
      {}, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          setUsers(data.data);
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const get_members_project = () => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    let projectId = parsed.pr;
    let userId = parsed.u;
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
    if(invited_flag == true && userId == null)
    {
      alert('user is not set');
      return;
    }
  
    _http.doPost('collab/get_members_project', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          // console.log(data.data)
          let cnt = 0;
          for(var i = 0; i < data.data.length; i ++)
          {
            if(data.data[i].invite_status == 'pending')
            {
              cnt = cnt + 1;
            }
          }
          // console.log('pending ', cnt);
          setMembers(data.data);
          setTotal(data.data.length);
          setPending(cnt);
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const doInvite = () => {
    if(invited_flag == true)
    {
      alert('invalid project');
      return;
    }
    if(invite_email.trim() ==  '' || invite_description.trim() ==  '')
    {
      return;
    }

    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    let projectId = parsed.pr;
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
    _http.doPost('collab/invite_user', 
      { 
        user_id : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        invite_email : invite_email.trim(),
        invite_description : invite_description
      }, 
      (data) => {
        if(data.status == false)
        {
          console.log('Invite failed');
          setLoading(false);  
          alert(data.data);
          showDialog(false);
        }
        else
        {
          setLoading(false);  
          showDialog(false);
          // get_members_project();
          document.location.reload();
        }
      },
      (err) => {
        setLoading(false);
        console.log('Error occured', err);
        alert('Error occured');
        showDialog(false);
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
        container
        style = {{justifyContent : 'center'}}
      >
        <Grid
          item
          container
          lg={12}
          md = {12}
          sm = {12}
          style = {{display : 'flex', justifyContent : 'center',  padding : '20px'}}
        >
          <Grid
            item
            container
            lg={6}
            md = {6}
            sm = {6}
          >
            <span style = {{marginRight : 8,}}>Total members : </span>
            <span>{total_members}</span>
            <span style={{marginLeft : 20,marginRight : 8}}>Pending invites : </span>
            <span>{pending_members}</span>
          </Grid>
          <Grid
            item
            container
            lg={6}
            md = {6}
            sm = {6}
            style = {{display : 'flex', justifyContent : 'flex-end'}}
          >
            {
              invited_flag == false ?
                <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    className={classes.button}
                    startIcon={<GroupAdd />}
                    onClick = {() => showDialog(true)}
                >
                  <span>invite members</span>
                </Button>
                :
                null
            }
          </Grid>
        </Grid>
        <Grid
          item
          container
          lg={12}
          md = {12}
          sm = {12}
          style = {{display : 'flex', justifyContent : 'center', }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className = {classes.tablecell}>Name</TableCell>
                <TableCell className = {classes.tablecell}>Phone</TableCell>
                <TableCell className = {classes.tablecell}>Company</TableCell>
                <TableCell className = {classes.tablecell}>Department</TableCell>
                <TableCell className = {classes.tablecell}>Office</TableCell>
                <TableCell className = {classes.tablecell}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map(member => (
                <TableRow
                  className={classes.tableRow}
                  hover
                  key={member.id}
                >
                  <TableCell className = {classes.tablecell}>
                    <div style = {{display : 'flex', alignItems : 'center', marginLeft: 6 }}>
                      <Avatar
                        style = {{width : '50px', height : '50px'}}
                        src={member.photo.original}
                      >
                        {getInitials(member.first_name + ' ' + member.last_name)}
                      </Avatar>
                      <div style={{marginLeft : '20px'}}>
                        <div>{member.first_name + ' ' + member.last_name}</div>
                        <div>{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className = {classes.tablecell} style = {{ wordWrap: 'break-word', maxWidth : '200px'}}>{member.phone}</TableCell>
                  <TableCell className = {classes.tablecell}>
                    {member.company}
                  </TableCell>
                  <TableCell className = {classes.tablecell}>
                    {member.department}
                  </TableCell>
                  <TableCell className = {classes.tablecell}>
                    {member.office}
                  </TableCell>
                  <TableCell className = {classes.tablecell}>
                    {member.invite_status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <Dialog disableBackdropClick disableEscapeKeyDown open={isDialog} onClose={() => showDialog(false)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" >
              <span style = {{fontWeight : 'bold'}}>Invite people to this project.</span>
          </DialogTitle>
          <DialogContent style = {{alignItems : 'flex-start', width : '600px'}} >
            <DialogContentText>
              Your teammates will get an notification that gives them access to your team.
            </DialogContentText>
            <form>
              {/* <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Invite user email"
                type="email"
                value = {invite_email}
                onChange = {event => setInviteEmail(event.target.value)}
                fullWidth
              /> */}
               <Autocomplete
                  freeSolo
                  disableClearable
                  options={users.map((user) => user.email + ' / ' + user.first_name + ' ' + user.last_name)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search input"
                      margin="dense"
                      variant="outlined"
                      id="email"
                      // label="Invite user email"
                      // type="email"
                      fullWidth
                      InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                  )}
                 
                  onChange = {(event, val) => setInviteEmail(val.split(' / ')[0])}
                />
              <TextField
                autoFocus
                margin="dense"
                id="description"
                label="Invite description"
                type="email"
                multiline = {true}
                rows = {7}
                variant="outlined"
                value = {invite_description}
                onChange = {event => setInviteDescription(event.target.value)}
                fullWidth
                style = {{marginTop : 20}}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => showDialog(false)} color="primary">
              Close
            </Button>
            <LoadingButton label = "Invite" label_loading = "Invite" loading = {loading} onClick = {doInvite}/>
          </DialogActions>
        </Dialog>
    </div>
    )
  );
};

Users.propTypes = {
  history: PropTypes.object
};

export default withRouter(Users);
