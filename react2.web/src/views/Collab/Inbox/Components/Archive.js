import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  Grid,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {_sessionStorage, _http} from 'helpers';
import * as qs from 'query-string';
import InboxItem from './InboxItem';

const useStyles = makeStyles(theme => ({
  root: {
      width : '100%'
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

  },
  detailcontainer : {

  }
}));

const Archive = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [inboxes, setInboxes] = useState([]);

  let registered_user = _sessionStorage.getItem('user');

 
  useEffect(() => {
    get_inboxes();
  }, []);


  const get_inboxes = () => {
    _http.doPost('collab/get_inboxes', 
      { 
        user_id : registered_user.id,
        inbox_status : 'achive'
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

  const setCurInbox = (inbox) => {
  }

  const onAccept = (inbox) => {
  }

  const onAchive = (inbox) => {
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
        lg={9}
        md = {9}
        sm = {12}
      >
        {
            inboxes.map((inbox) => 
              <InboxItem inbox_data = {inbox} onSelect = {(inbox) => setCurInbox(inbox)} onAccept = {onAccept} onAchive = {onAchive}/>
            )
        }
      </Grid>
      {/* <Grid
        item
        container
        className={classes.detailcontainer}
        lg={6}
        md = {6}
        sm = {12}
      >
        {
            inbox_detail.map((inbox) => 
              <InboxItem />
            )
        }
      </Grid> */}
    </Grid>
  );
};

Archive.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default Archive;
