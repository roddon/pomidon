import React, { useState, useEffect } from 'react';
import { useDrag, DragPreviewImage} from 'react-dnd'
import { Link as RouterLink, withRouter } from 'react-router-dom';
import moment from 'moment';
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
} from '@material-ui/core';
import {Add, ArrowDropDown, ArrowDropUp, MoreHoriz, DragIndicatorOutlined} from '@material-ui/icons';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage, getInitials} from 'helpers';
const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  tablecell : {
    padding : 0,
    paddingTop : 6,
    paddingBottom : 6
  },
}));


const  TaskItem = (props) => {
  const {task_item, section, openDetail, onUpdate, onDelete} = props;
  const classes = useStyles();

  const [{isDragging}, drag, preview] = useDrag({
    item: { type: 'task_item', name : task_item.name, task_id : task_item.id, section_id : section.id },
    previewOptions : {
      anchorX : 0,
      anchorY : 0
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  return (
    <TableRow
      className={classes.tableRow}
    >
      <TableCell  className = {classes.tablecell} style = {{paddingLeft : 6}} 
        >
        <div ref={drag} style={{
            width : '100%',
            opacity: isDragging ? 0.6 : 1,
            cursor: isDragging ? 'pointer' : 'move',
            // backgroundColor : isDragging ? '#f00' : '',
          }}>
          <span   style = {{marginLeft: 20, cursor : 'pointer', color : '#23f', textDecorationLine : 'underline'}} 
          onClick = {() => openDetail(task_item, section)}>{task_item.name}</span>
        </div>
          {/* <DragIndicatorOutlined  style = {{fontSize : 20}}/> */}
      </TableCell>
      <TableCell className = {classes.tablecell}/>
      <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>
        <div style = {{display : 'flex', alignItems : 'center', marginLeft: 6 }}>
          <Avatar
            style = {{width : '20px', height : '20px'}}
            src={task_item.assignee == null || task_item.assignee.photo == null ? '' : task_item.assignee.photo.original}
          >
            <span style = {{fontSize : 14}}>
              {task_item.assignee == null || task_item.assignee.photo == null ? ''
              :  getInitials(task_item.assignee.first_name + ' ' + task_item.assignee.last_name)}
            </span>
          </Avatar>
          <div style={{marginLeft : '20px'}}>
            <div>{task_item.assignee.first_name + ' ' + task_item.assignee.last_name}</div>
            {/* <div>{member.email}</div> */}
          </div>
        </div>
      </TableCell>
      <TableCell className = {classes.tablecell}/>
      <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>
        {task_item.due_date == null ? '' : moment(task_item.due_date).format('YYYY-MM-DD HH:mm')}
      </TableCell>
      <TableCell className = {classes.tablecell}/>
      <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>
        {task_item.priority}
      </TableCell>
      <TableCell className = {classes.tablecell}/>
      <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>
          <IconButton
            color='#151b26'
            variant="outlined"
            onClick = {() => onUpdate(task_item)}
            style = {{padding : 4}}
          >
            <EditIcon style = {{width : 18, height : 18}}/>
          </IconButton>
          <IconButton
            color='#151b26'
            variant="outlined"
            onClick = {() => onDelete(task_item)}
            style = {{padding : 4, marginLeft : 5}}
          >
            <DeleteIcon  style = {{width : 18, height : 18}}/>
          </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default TaskItem