import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
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
  Select,
  TextField,
  Collapse, 
  Drawer,
  DialogTitle, Dialog, DialogActions, DialogContent, DialogContentText, 
  InputLabel, FormControl, Divider,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Add, ArrowDropDown, ArrowDropUp, MoreHoriz} from '@material-ui/icons';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage, getInitials} from 'helpers';
import {LoadingButton, PageLoading} from 'components';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as qs from 'query-string';
import ColumnResizer from "react-column-resizer";
import SectionItem from './Component/SectionItem';
import TaskItem from './Component/TaskItem';
import TaskDetail from './Component/TaskDetail';
import DragSource from './Component/DragSource';
import DropTarget from './Component/DropTarget';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd';
import { usePreview } from 'react-dnd-preview';
import { Draggable, Droppable } from 'react-drag-and-drop'

const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    // height: '100%',
    marginBottom : 70,
    paddingLeft: 30,
    paddingRight: 30,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  grid: {
    // height: '100%'
  },
  contentContainer: {},
  content: {
    // height: '100%',
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
  columnSesizer : {
    width : 2
  },
  drawer: {
    width: '36vw',
    minWidth : drawerWidth,
    flexShrink: 0,
    height : '100%',
    overflow : 'hidden'
  },
  drawerPaper: {
    width: '36vw',
    minWidth : drawerWidth,
    overflow : 'hidden',
    boxShadow: '3px 3px 82px 14px rgba(32, 33, 36, .28)'
  },
  drawerContainer: {
    overflow: 'auto',
  },
  task_item_preview : {
    // minHeight : 40,
    minWidth : 200,
    backgroundColor : '#fff',
    color : '#000',
    fontSize : 14,
    padding : 5,
    fontWeight : 'bold',
    // borderColor : '#333',
    // borderWidth : 1,
    // borderStyle : 'solid',
    borderRadius : 5,
    opacity : 1,
    boxShadow: '3px 3px 4px 4px rgba(32, 33, 36, .28)',
    zIndex : 1000
  }
}));

const MyPreview = () => {
  const classes = useStyles();
  const {display, itemType, item, style} = usePreview();
  if (!display) {
    return null;
  }
  return <div className = {classes.task_item_preview} style={style}>{item.name}</div>;
};

const ListView = props => {
  const { history } = props;

  const classes = useStyles();
  const [members, setMembers] = useState([]);
  const [task_assignee, setTaskAssignee] = useState('');
  const [task_assignee_ui, setTaskAssigneeUI] = useState('');
  const [task_name, setTaskName] = useState('');
  const [task_description, setTaskDescription] = useState('');
  const [task_due, setTaskDue] = useState(new Date().toISOString().replace("Z", ""));
  const [task_priority, setTaskPriority] = useState('high');
  const [cur_section, setCurSection] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [users, setUsers] = useState([]);
  const [cur_task, setCurTask] = useState({});

  const [loading, setLoading] = useState(false);
  const [tasks_loading, setTasksLoading] = useState(false);
  const [isDialog, showDialog] = useState(false);
  const [isEditDialog, showEditDialog] = useState(false);
  const [isDeleteDialog, showDeleteDialog] = useState(false);
  const [pageLoaded, setPageLoad] = useState(false);
  const [task_name_hover, setTaskNameHover] = useState(false);
  const [isOpenTaskDetail, OpenTaskDetail] = useState(false);

  let invited_flag = false;
  let pathName = new URL(document.location.href).pathname;
  if(pathName == '/collab_invited_project')
  {
    invited_flag = true;
  }

  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
    get_auth_status();
    get_tasks(true);
    get_all_users();
  }, []);

  const get_auth_status = async () => {
    setPageLoad(true);
  }

  const isOpenSection = (section_id) => {
    for(var i = 0; i < sections.length; i ++)
    {
      if(sections[i].id == section_id)
      {
        if(sections[i].opened == true)
        {
          return true;
        }
        else
        {
          return false;
        }
      }
    }
    return false;
  }

  const onToggleSection = (section) => {
    let tmp_sections = sections.slice();
    for(var i = 0; i < tmp_sections.length; i ++)
    {
      if(tmp_sections[i].id == section.id)
      {
        tmp_sections[i].opened = !tmp_sections[i].opened;
        break;
      }
    }
    setSections(tmp_sections);
  }

  const get_tasks = (refresh_flag) => {
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

    if(refresh_flag != null && refresh_flag == true)
    {
      setTasksLoading(true);
    }
    _http.doPost('collab/get_tasks', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId
      }, 
      (data) => {
        setTasksLoading(false);
        if(data.status == false)
        {
          console.log('collab/get_tasks', data.data);
          alert(data.data);
        }
        else
        {
          let sections = [];
          for(var i = 0; i < data.data.length; i ++)
          {
            let tmp_section = data.data[i].section;
            tmp_section.opened = true;
            sections.push(tmp_section);
          }
          setSections(sections);
          setTasks(data.data);
        }
      },
      (err) => {
        setTasksLoading(false);
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const get_all_users = () => {
   
    _http.doPost('auth/users/get', 
      {}, 
      (data) => {
        if(data.status == false)
        {
          console.log('auth/users/get', data.data);
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

  const doAddTask = () => {

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

    let section = cur_section;
    if(section == null)
    {
        if(tasks.length == 0 || tasks[0].section == null)
        {
          alert('section is not set');
          return;
        }
        else
        {
          section = tasks[0].section ;
        }
    }

    console.log('section', section);

    setLoading(true);
    _http.doPost('collab/add_task', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        task_name : task_name,
        task_description : task_description,
        assignee : task_assignee,
        due_date : task_due,
        priority : task_priority,
        section_id : section.id, 
        section_name :section.name 
      }, 
      (data) => {
        if(data.status == false)
        {
          setLoading(false);
          alert(data.data);
        }
        else
        {
          showDialog(false);
          setLoading(false);
          get_tasks();
        }
      },
      (err) => {
        console.log(err);
        setLoading(false);
        alert('Error occured');
      }
    );
  }

  const doEditTask = (task) => {

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

    setLoading(true);
    _http.doPost('collab/update_task', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        task_id : task.id,
        task_name : task_name,
        task_description : task_description,
        assignee : task_assignee,
        due_date : task_due,
        priority : task_priority,
      }, 
      (data) => {
        if(data.status == false)
        {
          setLoading(false);
          alert(data.data);
        }
        else
        {
          get_tasks();
          showEditDialog(false);
          setLoading(false);
        }
      },
      (err) => {
        console.log(err);
        setLoading(false);
        alert('Error occured');
      }
    );
  }

  const doDeleteTask = (task) => {

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

    setLoading(true);
    _http.doPost('collab/delete_task', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        task_id : task.id,
      }, 
      (data) => {
        if(data.status == false)
        {
          setLoading(false);
          alert(data.data);
        }
        else
        {
          OpenTaskDetail(false);
          get_tasks();
          showDeleteDialog(false);
          setLoading(false);
        }
      },
      (err) => {
        console.log(err);
        setLoading(false);
        alert('Error occured');
      }
    );
  }
  
  const doAddSection = () => {
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

    _http.doPost('collab/add_section', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        section_name : 'New section',
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          let tmp_tasks = tasks.slice();
          tmp_tasks.push({
            section : data.data,
            task_list : []
          });
          setTasks(tmp_tasks);
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const doDeleteSection = (section) => {
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

    // setTasksLoading(true);
    _http.doPost('collab/delete_section', 
      { 
        user_id : invited_flag == true ? userId : registered_user.id,
        workspace_id : workspaceId,
        project_id : projectId,
        section_id : section.id
      }, 
      (data) => {
        if(data.status == false)
        {
          // setTasksLoading(false);
          alert(data.data);
        }
        else
        {
          get_tasks();
          // setTasksLoading(false);
        }
      },
      (err) => {
        // setTasksLoading(false);
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const openDetail = (task, section) => {
    setCurTask(task);
    setCurSection(section);
    OpenTaskDetail(true);
  }

  const onUpdate = (task) => {
    setCurTask(task);
    setTaskAssignee(task.assignee.email);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskDue(task.due_date);
    setTaskPriority(task.priority);
    setTaskAssigneeUI(task.assignee.email + ' / ' + task.assignee.first_name + ' ' + task.assignee.last_name)
    showEditDialog(true);
  }

  const onDelete = (task) => {
    setCurTask(task);
    showDeleteDialog(true);
  }

  const onDrop = (data) => {
    console.log(data)
    // => banana 
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <MyPreview />
        {
          pageLoaded == false ?
          <PageLoading />
          :
          <div className={classes.root}>
          <Grid
            className={classes.grid}
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
                style = {{display : 'flex', justifyContent : 'flex-start'}}
              >
                <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    className={classes.button}
                    startIcon={<Add />}
                    onClick = {() => {
                      if(tasks.length == 0 || tasks[0].section == null)
                      {
                        setCurSection(null);
                      }
                      else
                      {
                        setCurSection(tasks[0].section);
                      }
                      
                      showDialog(true)
                    }}
                >
                  <span>Add task</span>
                </Button>
              </Grid>
              <Grid item container lg={6} md = {6} sm = {6} >
              </Grid>
              <Divider style = {{width : '100%', marginTop : 15}}/>
            </Grid>
            <Grid
            
              item
              container
              lg={12}
              md = {12}
              sm = {12}
              style = {{display : 'flex', justifyContent : 'center', }}
            >
            {/* <DragSource />
            <DropTarget /> */}
            {
              tasks_loading == true ?
              <PageLoading />
              :
              <Table border = {1} borderColor="#eee">
                <TableHead>
                  <TableRow>
                    <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>Task name</TableCell>
                    <ColumnResizer className={classes.columnSesizer} />
                    <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>Assignee</TableCell>
                    <ColumnResizer className={classes.columnSesizer} />
                    <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>Due date</TableCell>
                    <ColumnResizer className={classes.columnSesizer}/>
                    <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>Priority</TableCell>
                    <ColumnResizer className={classes.columnSesizer}/>
                    <TableCell className = {classes.tablecell} style = {{paddingLeft : 6}}>Action</TableCell>
                  </TableRow>
                </TableHead>
                  {tasks.map((task, index) => (
                    <TableBody key = {index}>
                      <SectionItem section = {task.section} isOpened = {isOpenSection(task.section.id)} 
                        onToggle = {(section) => onToggleSection(section)} 
                        onAdd = {(section) => { setCurSection(section);  showDialog(true);}}
                        doDeleteSection = {doDeleteSection}
                        refreshList = {() => get_tasks()}
                        /> 
                      {
                        isOpenSection(task.section.id) == true?
                        task.task_list.map((task_item, id) => (
                          <TaskItem 
                            task_item = {task_item} section = {task.section} 
                            openDetail = {openDetail} 
                            onUpdate = {onUpdate}
                            onDelete = {onDelete}
                            style = {cur_task != null && cur_task.id == task_item.id ? {backgroundColor : '#00000033' } :  {}}/>
                        ))
                        :
                        null
                      }
                    </TableBody>
                  ))}
              </Table>
            }
              <Grid
                item
                container
                lg={12}
                md = {12}
                sm = {12}
                style = {{display : 'flex', justifyContent : 'flex-start', marginTop: 20}}
              >
                <Button
                    // variant="outlined"
                    color="primary"
                    size="small"
                    className={classes.button}
                    startIcon={<Add />}
                    onClick = {() => doAddSection()}
                >
                  <span>Add Section</span>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Drawer
            className={classes.drawer}
            variant= "persistent" // "temporary" // "permanent" // "persistent"
            anchor="right"
            open={isOpenTaskDetail}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <TaskDetail task = {cur_task} section = {cur_section} onClose = {() => {OpenTaskDetail(false)} } onDelete = {onDelete}/>
          </Drawer>
          <Dialog disableBackdropClick disableEscapeKeyDown open={isDialog} onClose={() => showDialog(false)} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title" >
                  <span style = {{fontWeight : 'bold'}}>Add a task to this project.</span>
              </DialogTitle>
              <DialogContent style = {{alignItems : 'flex-start', width : '600px'}} >
                <DialogContentText>
                  Please input task name and assignee and due date and priority.
                </DialogContentText>
                <form>
                  <TextField
                    autoFocus
                    variant="outlined"
                    margin="dense"
                    id="task_name"
                    label="Task name"
                    type="text"
                    value = {task_name}
                    onChange = {event => setTaskName(event.target.value)}
                    fullWidth
                  />
                  <Autocomplete
                      freeSolo
                      disableClearable
                      options={users.map((user) => user.email + ' / ' + user.first_name + ' ' + user.last_name)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assignee"
                          margin="dense"
                          variant="outlined"
                          id="email"
                          // label="Invite user email"
                          // type="email"
                          fullWidth
                          InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                      )}
                      onChange = {(event, val) => setTaskAssignee(val.split(' / ')[0])}
                    />
                    <TextField
                      variant="outlined"
                      margin="dense"
                      id="task_description"
                      label="Task description"
                      type="text"
                      value = {task_description}
                      onChange = {event => setTaskDescription(event.target.value)}
                      fullWidth
                      multiline = {true}
                      rows = {6}
                    />
                    <div style = {{display : 'flex', alignItems : 'center', marginTop : 20}}>
                      <span style = {{fontSize : '14px', marginRight : 10}}>Due date : </span>
                      <TextField
                        id="datetime-local"
                        // label="Next appointment"
                        type="datetime-local"
                        defaultValue= {task_due}   // "2017-05-24T10:30"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        name = "due_date"
                        onChange={(e) => setTaskDue(e.target.value)}
                        style = {{marginRight: '25px'}}
                      />
                      <FormControl  variant="outlined"  >
                        <InputLabel htmlFor="outlined-age-native-simple">Priority</InputLabel>
                        <Select native value={task_priority}
                          onChange={(e) => setTaskPriority(e.target.value)}
                          label="Male/Female"
                          inputProps={{
                            name: 'task_priority',
                            id: 'outlined-age-native-simple',
                            style : {padding : '8px',marginRight: '30px', width : '100%'}
                          }}
                        >
                          <option value='high'>High</option>
                          <option value='medium'>Medium</option>
                          <option value='low'>Low</option>
                        </Select>
                      </FormControl>
                    </div>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => showDialog(false)} color="primary">
                  Close
                </Button>
                <LoadingButton label = "Add" label_loading = "Add" loading = {loading} onClick = {() => doAddTask()}/>
              </DialogActions>
            </Dialog>

            <Dialog disableBackdropClick disableEscapeKeyDown open={isEditDialog} onClose={() => showEditDialog(false)} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title" >
                  <span style = {{fontWeight : 'bold'}}>Edit task details.</span>
              </DialogTitle>
              <DialogContent style = {{alignItems : 'flex-start', width : '600px'}} >
                <DialogContentText>
                  Please input task name or description or assignee or due date or priority which you want to change.
                </DialogContentText>
                <form>
                  <TextField
                    autoFocus
                    variant="outlined"
                    margin="dense"
                    id="task_name"
                    label="Task name"
                    type="text"
                    value = {task_name}
                    onChange = {event => setTaskName(event.target.value)}
                    fullWidth
                  />
                  <Autocomplete
                      freeSolo
                      disableClearable
                      value = {task_assignee_ui}
                      options={users.map((user) => user.email + ' / ' + user.first_name + ' ' + user.last_name)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assignee"
                          margin="dense"
                          variant="outlined"
                          id="email"
                          // label="Invite user email"
                          // type="email"
                          fullWidth
                          InputProps={{ ...params.InputProps, type: 'search' }}
                        />
                      )}
                      onChange = {(event, val) => setTaskAssignee(val.split(' / ')[0])}
                    />
                    <TextField
                      variant="outlined"
                      margin="dense"
                      id="task_description"
                      label="Task description"
                      type="text"
                      value = {task_description}
                      onChange = {event => setTaskDescription(event.target.value)}
                      fullWidth
                      multiline = {true}
                      rows = {6}
                    />
                    <div style = {{display : 'flex', alignItems : 'center', marginTop : 20}}>
                      <span style = {{fontSize : '14px', marginRight : 10}}>Due date : </span>
                      <TextField
                        id="datetime-local"
                        // label="Next appointment"
                        type="datetime-local"
                        defaultValue= {task_due}   // "2017-05-24T10:30"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        name = "due_date"
                        onChange={(e) => setTaskDue(e.target.value)}
                        style = {{marginRight: '25px'}}
                      />
                      <FormControl  variant="outlined"  >
                        <InputLabel htmlFor="outlined-age-native-simple">Priority</InputLabel>
                        <Select native value={task_priority}
                          onChange={(e) => setTaskPriority(e.target.value)}
                          label="Male/Female"
                          inputProps={{
                            name: 'task_priority',
                            id: 'outlined-age-native-simple',
                            style : {padding : '8px',marginRight: '30px', width : '100%'}
                          }}
                        >
                          <option value='high'>High</option>
                          <option value='medium'>Medium</option>
                          <option value='low'>Low</option>
                        </Select>
                      </FormControl>
                    </div>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => showEditDialog(false)} color="primary">
                  Close
                </Button>
                <LoadingButton label = "Update" label_loading = "Update" loading = {loading} onClick = {() => doEditTask(cur_task)}/>
              </DialogActions>
            </Dialog>

            <Dialog disableBackdropClick disableEscapeKeyDown open={isDeleteDialog} onClose={() => showDeleteDialog(false)} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title" >
                  <span style = {{fontWeight : 'bold'}}>Are you sure you want to delete this task?</span>
              </DialogTitle>
              <DialogContent style = {{alignItems : 'flex-start', width : '600px'}} >
                <DialogContentText>
                  This will delete everything in <b>{cur_task.name}</b>.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => showDeleteDialog(false)} color="primary">
                  Close
                </Button>
                <LoadingButton label = "Ok" label_loading = "Ok" loading = {loading} onClick = {() => {
                    showDeleteDialog(false);
                    doDeleteTask(cur_task);
                }}/>
              </DialogActions>
            </Dialog>
        </div>
      }
    </DndProvider>
    
  );
};

ListView.propTypes = {
  history: PropTypes.object
};

export default withRouter(ListView);
