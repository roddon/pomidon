import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Grid,
  Button,
  IconButton,
  TextField,
  Collapse, 
  Link,
  InputLabel, FormControl, Divider,DialogTitle, Dialog, DialogActions, DialogContent, DialogContentText, 
} from '@material-ui/core';
// import EditableLabel from 'react-inline-editing';
import {InlineInputEdit } from 'react-inline-input-edit';
import {Add, ArrowDropDown, ArrowDropUp, MoreHoriz, DescriptionOutlined, GetAppOutlined, AttachFileOutlined} from '@material-ui/icons';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage, getInitials} from 'helpers';
import {LoadingButton, PageLoading} from 'components'
import * as qs from 'query-string';
import MenuButton from './MenuButton';

const useStyles = makeStyles(theme => ({
  editLabel : {
    lineHeight : '30px'
  }
}));

const CommentItem = props => {
  const { history, comment,  } = props;

  const classes = useStyles();
  let registered_user = _sessionStorage.getItem('user');
  const [pageLoaded, setPageLoad] = useState(false);

  useEffect(() => {
    get_auth_status();
  }, []);

  const get_auth_status = async () => {
    setPageLoad(true);
  }

  return (
    (
      <div style = {{alignItems : 'center', marginTop : 12}}>
        <div style = {{display : 'flex', alignItems : 'center', marginLeft: 6, width : '100%' }}>
          <Avatar
            style = {{width : '24px', height : '24px'}}
            src={comment.author == null || comment.author.photo == null ? '' : comment.author.photo.original}
          >
            <span style = {{fontSize : 14}}>
              {comment.author == null || comment.author.photo == null ? ''
              :  getInitials(comment.author.first_name + ' ' + comment.author.last_name)}
            </span>
          </Avatar>
          <div style={{marginLeft : '16px'}}>
            <div style = {{fontSize : '14px', fontWeight : 'bold'}}>{comment.author.first_name + ' ' + comment.author.last_name}</div>
            {/* <div>{member.email}</div> */}
          </div>
          <div style={{marginLeft : '20px'}}>
            <div style = {{fontSize : '12px'}}>{moment(comment.createdAt).format('YYYY-MM-DD HH:mm')}</div>
          </div>
        </div>
        {
          comment.msg != null ?
          <div style = {{display : 'flex', alignItems : 'center', marginLeft: 6, paddingLeft : 40, fontSize : '14px' }}>
              {comment.msg}
          </div>
          : null
        }
        {
          comment.file != null ?
          <div style = {{display : 'flex', alignItems : 'center', marginLeft: 6,  paddingLeft : 40,  fontSize : '14px' }}>
              {
                comment.file.file_type.includes('image') == true ?
                <div style = {{width : '100%'}}>
                    <Link href={comment.file.file_url} target="_blank" download>
                      <img src = {comment.file.file_url} style = {{width : '80%'}} />
                    </Link>
                    <div style = {{display : 'flex', alignItems : 'center', width : '80%'}}>
                      <span>{comment.file.file_name}</span>
                      <span style = {{flex : 1}}></span>
                      <Link href={comment.file.file_url} target="_blank" download>
                        <span style = {{fontSize  : '14px', color : '#34e', textDecorationLine : 'underline', cursor : 'pointer'}}>Download</span>
                      </Link>
                    </div>
                </div>
                : 
                <div style = {{display : 'flex', alignItems : 'center', width : '80%', borderWidth : 1,
                     borderColor : '#454545', borderRadius : 10, borderStyle : 'dashed', height : 60}}>
                  <DescriptionOutlined style = {{fontSize : 32, color : '#454545'}} />
                  <div style={{width : '100%'}}>
                    <div style = {{fontSize : 18, fontWeight : 'bold', marginLeft : 6}} >{comment.file.file_name}</div>
                    <div style = {{display : 'flex', alignItems : 'center'}}>
                      <AttachFileOutlined style = {{fontSize : 14, color : '#454545'}} />
                      <span style = {{fontSize : 14, color : '#454545'}} >Attachment</span>
                    </div>
                  </div>
                  <div style={{flex : 1}}> </div>
                  <Link href={comment.file.file_url} target="_blank" download>
                    <IconButton style = {{padding : 5, marginRight : 10}} >
                      <GetAppOutlined style = {{fontSize : 24, color : '#222'}}/>
                    </IconButton>
                  </Link>
                </div>
              }
          </div>
          : null
        }
      </div>
    )
  );
};

CommentItem.propTypes = {
  history: PropTypes.object
};

export default withRouter(CommentItem);
