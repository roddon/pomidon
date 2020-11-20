import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  Grid,
  Button,
  IconButton,
  TextField,
  Collapse, 
  InputLabel, FormControl, Divider,DialogTitle, Dialog, DialogActions, DialogContent, DialogContentText, 
} from '@material-ui/core';
// import EditableLabel from 'react-inline-editing';
import {InlineInputEdit } from 'react-inline-input-edit';
import {Add, ArrowDropDown, ArrowDropUp, MoreHoriz, AttachFile,DeleteOutline, KeyboardTab, RefreshOutlined,
   PersonOutlined, EventOutlined, LabelImportant, LowPriorityOutlined, AssignmentOutlined, CommentOutlined} from '@material-ui/icons';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage, getInitials} from 'helpers';
import {LoadingButton, PageLoading} from 'components'
import * as qs from 'query-string';
import MenuButton from './MenuButton';
import CommentItem from './CommentItem';

const useStyles = makeStyles(theme => ({
  root : {
    width : '100%'
  },
  header : {
    width : '100%',
    display : 'flex',
    alignItems : 'center',
    minHeight : '56px',
    paddingLeft : 10,
    paddingRight : 15,
  },
  detail : {
    width : '100%',
    // display : 'flex',
    // alignItems : 'center',
    height : 'calc(100vh - 260px)',
    // paddingBottom : 100,
    paddingLeft : 10,
    paddingRight : 15,
    overflowY : 'auto'
  },
  detail_line : {
    width : '100%',
    display : 'flex',
    alignItems : 'center',
    marginTop: 15
  },
  msgForm : {
    width : '100%',
    height : 240,
    paddingLeft : 10,
    paddingRight : 15,
  },
  comments : {
    width : '100%',
    marginTop : 30,
    paddingTop : 10,
    paddingLeft : 10,
    paddingRight : 15,
  },
}));

const TaskDetail = props => {
  const { history, task, section, isOpened, onClose, onDelete, doDeleteSection,  } = props;

  const classes = useStyles();
  const [pageLoaded, setPageLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file_loading, setFileLoading] = useState(false);
  const [comments_loading, setCommentsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [task_comment, setTaskComment] = useState('')
  const [fileobj, setFileObj] = useState(null);
 
  const fileForm = useRef(null);

  let invited_flag = false;
  let pathName = new URL(document.location.href).pathname;
  if(pathName == '/collab_invited_project')
  {
    invited_flag = true;
  }

  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
    get_auth_status();
    get_comments(task);
  }, [task, section]);

  const get_auth_status = async () => {
    setPageLoad(true);
  }

  const get_comments = (task_item) => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    let projectId = parsed.pr;
    let userId = parsed.u;
    if(workspaceId == null || workspaceId == 'undefined')
    {
      alert('Workspace is not set');
      return;
    }
    if(projectId == null || projectId == 'undefined')
    {
      alert('project is not set');
      return;
    }
    if(invited_flag == true && userId == null)
    {
      alert('user is not set');
      return;
    }

    if(task_item.id == null || task_item.id == 'undefined')
    {
      return;
    }
    setCommentsLoading(true);
    _http.doPost('collab/get_task_comments', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        task_id : task_item.id
      }, 
      (data) => {
        setCommentsLoading(false);
        if(data.status == false)
        {
          console.log('collab/get_task_comments', data.data);
          alert(data.data);
        }
        else
        {
          setComments(data.data);
        }
      },
      (err) => {
        setCommentsLoading(false);
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const add_comment = (file, msg) => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    let projectId = parsed.pr;
    let userId = parsed.u;
    if(workspaceId == null || workspaceId == 'undefined')
    {
      alert('Workspace is not set');
      return;
    }
    if(projectId == null || projectId == 'undefined')
    {
      alert('project is not set');
      return;
    }
    if(invited_flag == true && userId == null)
    {
      alert('user is not set');
      return;
    }
  
    let body_data = {
      user_id : invited_flag == true ? userId : registered_user.id,
      author_id : registered_user.id,
      workspace_id : workspaceId,
      project_id : projectId,
      task_id : task.id
    }
    if(file != null)
    {
      body_data.file = file;
    }
    if(msg != null)
    {
      body_data.msg = msg;
    }
    _http.doPost('collab/add_comment_task', 
      body_data, 
      (data) => {
        if(data.status == false)
        {
          console.log('collab/add_comment_task', data.data);
          alert(data.data);
        }
        else
        {
          setComments(comments => [...comments, data.data]);
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const _handleFileChange = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    // console.log('file', file);
    // setFileObj(file);
    let formData = new FormData();
    formData.append('file', file);

    setFileLoading(true);
    _http.doPostFile('collab/task_file_upload', 
      formData,
      (data) => {
        console.log(data);
        setFileLoading(false);
        add_comment(data, null);
      },
      (err) => {
        setFileLoading(false);
        alert('Error occured on uploading : ' + err);
      }
    )
  }

  const onAttachFile = () => {
    try {
      fileForm.current.click();
    } 
    catch (error) {
      console.log(error);
    }
  }
  
  const leaveComment = () => {
    if(task_comment == null || task_comment == '')
    {
      return;
    }
    setTaskComment('');
    add_comment(null, task_comment);
  }

  const onRefresh = (task) => {
    get_comments(task);
  }

  return (
    (
      <div className = {classes.root}>
        <div className = {classes.header}>
          <IconButton style = {{padding : 5}} 
            aria-controls="customized-menu"
            aria-haspopup="true"
            onClick = {onClose}
          >
            <KeyboardTab style= {{fontSize : 24}}/>
          </IconButton>
          <span style = {{fontSize : '20px', marginLeft : 15}}>{task.name}</span>
          <span style = {{flex : 1}}></span>
          <input 
              ref = {fileForm}
              style={{display : 'none'}} 
              type="file" 
              onChange={(e)=> _handleFileChange(e)} />
          {
            file_loading == true ?
            <div style={{width : 150, height : '100%', display : 'flex', alignItems : 'center', justifyContent : 'flex-end'}}>
              <img src = "/images/system/loading_64x64.gif" 
                style = {{ width :  28, height : 28}}/>
              <span style = {{fontSize : 14, marginLeft : 15}}>file is uploading...</span>
            </div>
            :
            <IconButton style = {{padding : 5}} 
              aria-controls="customized-menu"
              aria-haspopup="true"
              onClick = {onAttachFile}
            >
              <AttachFile style= {{fontSize : 24}}/>
            </IconButton>
          }
          
          
          <IconButton style = {{padding : 5, marginLeft : 5, marginRight : 5}} 
            aria-controls="customized-menu"
            aria-haspopup="true"
            onClick = {() => {onRefresh(task);}}
          >
            <RefreshOutlined style= {{fontSize : 24}}/>
          </IconButton>
          <IconButton style = {{padding : 5}} 
            aria-controls="customized-menu"
            aria-haspopup="true"
            onClick = {() => {onDelete(task);}}
          >
            <DeleteOutline style= {{fontSize : 24}}/>
          </IconButton>
        </div>
        <Divider />
        <div className = {classes.detail}>
          <div className = {classes.detail_line}>
            <IconButton style = {{padding : 5}} 
              aria-controls="customized-menu"
              aria-haspopup="true"
            >
              <PersonOutlined style= {{fontSize : 20}}/>
            </IconButton>
            <span style = {{fontSize : '16px', marginLeft : 6}}>Assignee </span>
            <div style = {{display : 'flex', alignItems : 'center', marginLeft: 40 }}>
              <Avatar
                style = {{width : '20px', height : '20px'}}
                src={task.assignee == null || task.assignee.photo == null ? '' : task.assignee.photo.original}
              >
                <span style = {{fontSize : 14}}>
                  {task.assignee == null || task.assignee.photo == null ? ''
                  :  getInitials(task.assignee.first_name + ' ' + task.assignee.last_name)}
                </span>
              </Avatar>
              <div style={{marginLeft : '14px'}}>
                <div style = {{fontSize : 18}}>
                  {
                    task.assignee == null ? '' :
                    task.assignee.first_name + ' ' + task.assignee.last_name
                  }
                </div>
                {/* <div>{member.email}</div> */}
              </div>
            </div>
          </div>
          <div className = {classes.detail_line}>
            <IconButton style = {{padding : 5}} 
              aria-controls="customized-menu"
              aria-haspopup="true"
            >
              <EventOutlined style= {{fontSize : 20}}/>
            </IconButton>
            <span style = {{fontSize : '16px', marginLeft : 6}}>Due date </span>
            <div style = {{display : 'flex', alignItems : 'center', marginLeft: 40, fontSize : 18 }}>
              {task.due_date == null ? '' : moment(task.due_date).format('YYYY-MM-DD HH:mm')}
            </div>
          </div>
          <div className = {classes.detail_line}>
            <IconButton style = {{padding : 5}} 
              aria-controls="customized-menu"
              aria-haspopup="true"
            >
              <LabelImportant style= {{fontSize : 20}}/>
            </IconButton>
            <span style = {{fontSize : '16px', marginLeft : 6}}>Section </span>
            <div style = {{display : 'flex', alignItems : 'center', marginLeft: 40 , fontSize : 18}}>
              {section == null ? '' : section.name}
            </div>
          </div>
          <div className = {classes.detail_line}>
            <IconButton style = {{padding : 5}} 
              aria-controls="customized-menu"
              aria-haspopup="true"
            >
              <LowPriorityOutlined style= {{fontSize : 20}}/>
            </IconButton>
            <span style = {{fontSize : '16px', marginLeft : 6}}>Priority </span>
            <div style = {{display : 'flex', alignItems : 'center', marginLeft: 40 , fontSize : 18}}>
              {task == null ? '' : task.priority}
            </div>
          </div>
          <div className = {classes.detail_line} style = {{alignItems : 'flex-start'}}>
            <IconButton style = {{padding : 5}} 
              aria-controls="customized-menu"
              aria-haspopup="true"
            >
              <AssignmentOutlined style= {{fontSize : 20}}/>
            </IconButton>
            <span style = {{fontSize : '16px', marginLeft : 6}}>Description </span>
            <div style = {{display : 'flex', alignItems : 'center', marginLeft: 40 , fontSize : 14}}>
              {task == null ? '' : task.description}
            </div>
          </div>
        
          <div className = {classes.comments}>
            {
              comments_loading == true?
              <PageLoading width = {48} height = {48} />
              :
              comments.map((comment, index) => (
                <CommentItem comment = {comment}/>
              ))
            }  
          </div>
        </div>
        <Divider />
        <div className = {classes.msgForm}>
          <div style = {{display : 'flex', alignItems : 'flex-start'}}>
            <IconButton style = {{padding : 5, marginTop : 10}} 
              aria-controls="customized-menu"
              aria-haspopup="true"
            >
              <CommentOutlined style= {{fontSize : 22}}/>
            </IconButton>
            <TextField
              variant="outlined"
              margin="dense"
              id="task_comment"
              // label="Task description"
              type="text"
              placeholder = 'Ask a question or post an update'
              value = {task_comment}
              onChange = {event => setTaskComment(event.target.value)}
              fullWidth
              multiline = {true}
              rows = {6}
            />
          </div>
          <div style = {{display : 'flex', alignItems : 'flex-start', justifyContent : 'flex-end'}}>
            <Button variant = 'outlined' onClick = {leaveComment}>
                Comment
            </Button>  
          </div>
        </div>
      </div>
    )
  );
};

TaskDetail.propTypes = {
  history: PropTypes.object
};

export default withRouter(TaskDetail);
