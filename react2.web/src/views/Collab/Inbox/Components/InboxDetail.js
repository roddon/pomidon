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
  Avatar,
  Divider,
  Tooltip,
  IconButton, 
} from '@material-ui/core';
import {NotificationsNone, ChevronRight, EventOutlined, LabelImportant, CheckCircleOutline, HighlightOff} from '@material-ui/icons';
import {_sessionStorage, _http, getInitials} from 'helpers';
import * as qs from 'query-string';

const useStyles = makeStyles(theme => ({
  root: {
      width : '100%',
      paddingTop : 10,
      paddingBottom : 10,
      paddingLeft : 15,
      paddingRight : 10,
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
  title: {
    display : 'flex',
    alignItems: 'center',
    marginBottom : 10
  },
  project_detail : {
    display : 'flex',
    alignItems : 'center',
    marginTop : 15,
    marginBottom : 10
  },
  project_info : {
    marginLeft : 10,
    display : 'flex',
    alignItems : 'center'
  }
}));

const InboxDetail = props => {
  const { className, inbox_data, ...rest } = props;

  const classes = useStyles();
  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
  }, []);

  return (
    (
      inbox_data == null ?
      <div
        {...rest}
        className={clsx(classes.root, className)}
      ></div>
      :
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
            <div className={classes.title}>
              <NotificationsNone /> 
              <span style = {{fontSize : 16, fontWeight : 'bold', marginRight : 15}}>New Invitation</span>
              <span style = {{flex : 1}}></span>
              <span style = {{fontSize : 16, marginRight : 15}}>
                {moment(inbox_data.createdAt).format('YYYY-MM-DD HH:mm')}
              </span>
              {/* <Tooltip title="Accept invitation" arrow>
                <IconButton style = {{padding : 5}}>
                  <CheckCircleOutline />
                </IconButton>
              </Tooltip>
              <Tooltip title="Achive" arrow>
                <IconButton style = {{padding : 5}}>
                  <HighlightOff />
                </IconButton>
              </Tooltip> */}
            </div>
            <Divider />
            <div className={classes.project_detail}>
              <div style = {{marginRight : '60px'}}>owner</div>
              <div style = {{display : 'flex', alignItems : 'center', marginLeft: 6, marginRight : 15 }}>
                <Avatar
                  style = {{width : '50px', height : '50px'}}
                  src={inbox_data.owner.photo.original}
                >
                  {getInitials(inbox_data.owner.first_name + ' ' + inbox_data.owner.last_name)}
                </Avatar>
                <div style={{marginLeft : '20px'}}>
                  <div style = {{fontSize : 16, marginRight : 10,}}>{inbox_data.owner.first_name + ' ' + inbox_data.owner.last_name}</div>
                  <div style = {{fontSize : 16, marginRight : 10,}}>{inbox_data.owner.email}</div>
                </div>
              </div>
            </div>
            <div className={classes.project_detail}>
              <div style = {{marginRight : '50px'}}>project</div>
              <div className={classes.project_info}>
                  <LabelImportant style = {{fontSize : 16, marginRight : 10,}}/><span>{inbox_data.invite_project.project_name}</span>
                  <ChevronRight style = {{fontSize : 18}}/>
                  {
                    inbox_data.invite_project.task_name != null?
                    <span>Task 1</span>
                    : null
                  }
                </div>
            </div>
            <div className={classes.project_detail}>
              <div style = {{marginRight : '35px'}}>
                Due date
              </div>
              <div className={classes.project_info}>
                <span>{moment(inbox_data.invite_project.project_due_date).format('YYYY-MM-DD HH:mm')}</span>
              </div>
            </div>
            <div className={classes.project_detail} style = {{alignItems : 'flex-start'}}>
              <div style = {{marginRight : '35px'}}>
                Description
              </div>
              <div className={classes.project_info}>
                <span style = {{wordWrap : 'anywhere'}}>{inbox_data.invite_project.project_description}</span>
              </div>
            </div>
      </div>
    )
  );
};

InboxDetail.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default InboxDetail;
