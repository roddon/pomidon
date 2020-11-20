import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Divider
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {_sessionStorage, _http} from 'helpers';
import * as qs from 'query-string';
import InboxItem from './InboxItem';
import InboxDetail from './InboxDetail';

const useStyles = makeStyles(theme => ({
  root: {
      width : '100%',
      marginTop : 20
  },
  content: {
    padding: 0
  },
  inner: {
    width : '100%'
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  listcontainer : {
    marginRight : '-1px'
  },
  detailcontainer : {

  }
}));

const Activity = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [inboxes, setInboxes] = useState([]);
  const [cur_inbox, setCurInbox] = useState(null);
 
  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
    get_inboxes();
  }, []);


  const get_inboxes = () => {
    _http.doPost('collab/get_inboxes', 
      { 
        user_id : registered_user.id,
        inbox_status : 'active'
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          setInboxes(data.data);
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }
  
  const onAccept = (inbox) => {
    _http.doPost('collab/accept_invite', 
      { 
        user_id : registered_user.id,
        invited_project_id : inbox.invite_project.id,
        inbox_id : inbox.id,
        owner_id : inbox.owner.id,
        owner_workspace_id : inbox.invite_project.workspace_id,
        owner_project_id : inbox.invite_project.project_id
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          document.location.reload();
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
    
  }

  const onAchive = (inbox) => {
    _http.doPost('collab/achive_inbox', 
      { 
        user_id : registered_user.id,
        inbox_id : inbox.id,
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          document.location.reload();
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }

  return (
    <Grid
      className={classes.root}
        container
        style = {{justifyContent : 'center'}}
      >
      <Grid
        item
        container
        className={classes.listcontainer}
        lg={6}
        md = {6}
        sm = {12}
      >
        {
            inboxes.map((inbox) => 
              <div style = {{width : '100%'}}>
                <Divider />
                <InboxItem inbox_data = {inbox} onSelect = {(inbox) => setCurInbox(inbox)} onAccept = {onAccept} onAchive = {onAchive}/>
                {/* <Divider /> */}
              </div>
            )
        }
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid
        item
        container
        className={classes.detailcontainer}
        lg={6}
        md = {6}
        sm = {12}
      >
         <InboxDetail inbox_data = {cur_inbox} />
      </Grid>
    </Grid>
  );
};

Activity.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default Activity;
