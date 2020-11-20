import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd'
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
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
import {Add, ArrowDropDown, ArrowDropUp, MoreHoriz} from '@material-ui/icons';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage, getInitials} from 'helpers';
import {LoadingButton, PageLoading} from 'components'
import * as qs from 'query-string';
import MenuButton from './MenuButton';

const useStyles = makeStyles(theme => ({
  editLabel : {
    lineHeight : '30px'
  }
}));

const SectionItem = props => {
  const { history, section, isOpened, onToggle, onAdd, doDeleteSection, refreshList, } = props;

  const classes = useStyles();
  const [pageLoaded, setPageLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditDialog, showEditDialog] = useState(false);
  const [isDeleteDialog, showDeleteDialog] = useState(false);
  const [section_name, setSectionName] = useState(section.name);
  const [new_section_name, setNewSectionName] = useState(section.name);

  let invited_flag = false;
  let pathName = new URL(document.location.href).pathname;
  if(pathName == '/collab_invited_project')
  {
    invited_flag = true;
  }

  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
    get_auth_status();
  }, []);

  const get_auth_status = async () => {
    setPageLoad(true);
  }

  const _handleFocus =  (text) => {
    // console.log('_handleFocus', text);
  }

  const _handleFocusOut =  (text) => {
    // console.log('_handleFocusOut', text);
    doRenameSection(text);
  }

  const onEditSection = (e) => {
    showEditDialog(true);
  }

  const onDeleteSection = () => {
    showDeleteDialog(true);
  }

  const doRenameSection = (section_name) => {
  
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

    showEditDialog(false);
    setLoading(true);
    _http.doPost('collab/update_section', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        section_id : section.id,
        section_name : section_name,
      }, 
      (data) => {
        if(data.status == false)
        {
          setLoading(false);
          alert(data.data);
        }
        else
        {
          setTimeout(() => {
            setLoading(false);
          }, 3000)
         
          setSectionName(data.data.name);
        }
      },
      (err) => {
        setLoading(false);
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const [{ isOver, data }, drop] = useDrop({
    accept: 'task_item',
    canDrop: () => { return true},
    drop: () => {
      console.log('dropped' , data.task_id, data.section_id);
      changeSectionOfTask(data.task_id);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      data : monitor.getItem()
    }),
  })

  const changeSectionOfTask = (task_id) => {
    
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

    _http.doPost('collab/move_task_section', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        task_id : task_id,
        section_id : section.id
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          refreshList();
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }

  return (
    (
      <div  ref={drop} style = {{display : 'flex', alignItems : 'center', backgroundColor : isOver ? '#00ff0022' : '#fff'}}>
        <IconButton style = {{padding : 5}} onClick = {() => onToggle(section)}>
          {
            isOpened == false ? <ArrowDropDown /> : <ArrowDropUp />
          }
        </IconButton>
        {
          loading == true ? 
          <span style = {{fontSize : '14px', fontWeight : 'bold'}}>{section_name}</span> 
          :
          <InlineInputEdit 
            text= {section_name}
            labelClassName= {classes.editLabel}
            // inputClassName='myInputClass'
            labelFontSize = {14}
            inputWidth='150px'
            inputHeight='25px'
            inputMaxLength='50'
            labelFontWeight='bold'
            // inputFontWeight='bold'
            onFocus={_handleFocus}
            onFocusOut={_handleFocusOut}
          />
        }
       
        {/* <div style = {{fontSize : 14, fontWeight : 'bold'}}>{section.name}</div> */}
        <IconButton style = {{padding : 5, marginLeft : 15, marginRight : 5}} 
          onClick = {() => onAdd(section)}
        >
          <Add style= {{fontSize : 20}}/>
        </IconButton>
        <MenuButton  onEdit = {onEditSection} onDel = {onDeleteSection}/>
        <Dialog disableBackdropClick disableEscapeKeyDown open={isEditDialog} onClose={() => showEditDialog(false)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" >
              <span style = {{fontWeight : 'bold'}}>Rename section.</span>
          </DialogTitle>
          <DialogContent style = {{alignItems : 'flex-start', width : '600px'}} >
            <DialogContentText>
              Please input section name.
            </DialogContentText>
              <TextField
                autoFocus
                variant="outlined"
                margin="dense"
                id="new_section_name"
                label="Section name"
                type="text"
                value = {new_section_name}
                onChange = {event => setNewSectionName(event.target.value)}
                fullWidth
              />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => showEditDialog(false)} color="primary">
              Close
            </Button>
            <LoadingButton label = "Add" label_loading = "Add" loading = {loading} onClick = {() => doRenameSection(new_section_name)}/>
          </DialogActions>
        </Dialog>
        <Dialog disableBackdropClick disableEscapeKeyDown open={isDeleteDialog} onClose={() => showDeleteDialog(false)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title" >
              <span style = {{fontWeight : 'bold'}}>Are you sure you want to delete this section?</span>
          </DialogTitle>
          <DialogContent style = {{alignItems : 'flex-start', width : '600px'}} >
            <DialogContentText>
              This will delete everything in <b>{section.name}</b> including tasks.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => showDeleteDialog(false)} color="primary">
              Close
            </Button>
            <LoadingButton label = "Ok" label_loading = "Ok" loading = {loading} onClick = {() => {
                showDeleteDialog(false);
                doDeleteSection(section);
            }}/>
          </DialogActions>
        </Dialog>
      </div>
    )
  );
};

SectionItem.propTypes = {
  history: PropTypes.object
};

export default withRouter(SectionItem);
