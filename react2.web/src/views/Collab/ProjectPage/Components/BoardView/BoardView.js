import React, {useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
import {AddOutlined, ArrowDropDown, ArrowDropUp, MoreHoriz} from '@material-ui/icons';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage, getInitials} from 'helpers';
import {LoadingButton, PageLoading} from 'components';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as qs from 'query-string';
import BoardItem from './Component/BoardItem';
import MenuButton from './Component/MenuButton';
import SectionItem from './Component/SectionItem';

const reorder = (list, startIndex, endIndex) => {
    console.log('reorder', list)
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#00003317' : '#00000007',
    padding: grid,
    marginRight : 20,
    width: 300,
    height : 'calc(100% - 70px)',
    flexGrow: 1,
    overflowY : 'auto',
});

 const BoardView = (props) => {

    const [users, setUsers] = useState([]);
    const [cur_task, setCurTask] = useState({});
    const [tasks, setTasks] = useState([]);
    const [sections, setSections] = useState([]);
    ////////////////////
    const [task_assignee, setTaskAssignee] = useState('');
    const [task_assignee_ui, setTaskAssigneeUI] = useState('');
    const [task_name, setTaskName] = useState('');
    const [task_description, setTaskDescription] = useState('');
    const [task_due, setTaskDue] = useState(new Date().toISOString().replace("Z", ""));
    const [task_priority, setTaskPriority] = useState('high');
    ////////////////////
    const [cur_section, setCurSection] = useState(null);
    const [isOpenTaskDetail, OpenTaskDetail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDialog, showDialog] = useState(false);
    const [isEditDialog, showEditDialog] = useState(false);
    const [tasks_loading, setTasksLoading] = useState(false);
    const [isDeleteDialog, showDeleteDialog] = useState(false);

    let invited_flag = false;
    let pathName = new URL(document.location.href).pathname;
    if(pathName == '/collab_invited_project')
    {
      invited_flag = true;
    }
    
    let registered_user = _sessionStorage.getItem('user');

    useEffect(() => {
        get_tasks(true);
        get_all_users();
    }, []) 

    const getList = section_id => {
        let task_list = [];
        let index = 0;
        for(var i = 0; i < tasks.length; i ++)
        {
            if(tasks[i].section.id == section_id)
            {
                task_list = tasks[i].task_list;
                index = i;
            }
        }
        
        return {task_list, index};
    }

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        // console.log("source, destination", source.index, destination.index);
        if (source.droppableId === destination.droppableId) {
            let origin_list = getList(source.droppableId);
            const new_task_list = reorder(
                origin_list.task_list,
                source.index,
                destination.index
            );
            let tmp_tasks = tasks.slice();
            tmp_tasks[origin_list.index].task_list = new_task_list;
            setTasks(tmp_tasks);
        } else {
            let source_list = getList(source.droppableId);
            let destination_list = getList(destination.droppableId);
            
            changeSectionOfTask(tasks[source_list.index].task_list[source.index].id, destination.droppableId);

            const result = move(
                source_list.task_list,
                destination_list.task_list,
                source,
                destination
            );

            let new_source_task_list = result[source.droppableId];
            let new_destination_task_list = result[destination.droppableId];
            let tmp_tasks = tasks.slice();
            tmp_tasks[source_list.index].task_list = new_source_task_list;
            tmp_tasks[destination_list.index].task_list = new_destination_task_list;
            setTasks(tmp_tasks);
            
        }
    };

    
  const changeSectionOfTask = (task_id, section_id) => {
    
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
        section_id : section_id
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          console.log('move_task_section', data.data);
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
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

    const onAddTask = () => {
        showDialog(true);
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {
                tasks.map((task, index) => (
                    <div  style = {{ height : '100%',}}>
                        {/* <div style = {{ marginRight : 20, width: 300, height : '70px'}}>
                            <div style = {{display : 'flex', alignItems : 'center'}}>
                                <span style = {{fontSize : 16, fontWeight : 'bold'}}>{task.section.name}</span>
                                <span style = {{flex : 1}}></span>
                                <MenuButton  onEdit = {onEditSection} onDel = {onDeleteSection}/>
                            </div>
                            <Button 
                                style = {{width : '100%', marginTop : 5, marginBottom : 8}}
                                variant = "outlined" size = "small" onClick = {() => onAddTask()} >
                                <AddOutlined style = {{fontSize : 18}} />
                            </Button>
                        </div> */}
                        <SectionItem section = {task.section} 
                            onAdd = {(section) => { setCurSection(section);  showDialog(true);}}
                            doDeleteSection = {doDeleteSection}
                            refreshList = {() => get_tasks()}
                            /> 
                        <Droppable key = {index} droppableId={task.section.id}> 
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {task.task_list.map((task_item, id) => (
                                        <BoardItem key = {id} task_item = {task_item} index = {id} 
                                            onUpdate = {onUpdate}
                                            onDelete = {onDelete}/>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>    
                    </div>
                ))
            }
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
        </DragDropContext>
    );
}

export default BoardView;