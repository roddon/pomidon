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
  tablecell : {
      padding : 0,
      paddingTop : 6,
      paddingBottom : 6
  }
}));

const MyProjectsTable = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [projects, setProjects] = useState([]);

  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
    get_projects();
  }, []);

  const handlePageChange = (event, page) => {
    setPage(page);
  };
  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  const get_projects = () => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    if(workspaceId == null)
    {
      alert('Workspace is not set');
      return;
    }
  
    _http.doPost('collab/get_project', 
      { 
        user_id : registered_user.id,
        workspace_id : workspaceId
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          setProjects(data.data);
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const onUpdate = (project_id) => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    if(workspaceId == null)
    {
      alert('Workspace is not set');
      return;
    }
    document.location.href = '/collab_editproject?ws=' + workspaceId + '&pr=' + project_id;
  }

  const onDelete = (project_id) => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    if(workspaceId == null)
    {
      alert('Workspace is not set');
      return;
    }
  
      _http.doPost('collab/delete_project', 
      { 
        user_id : registered_user.id,
        workspace_id : workspaceId,
        project_id : project_id
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          get_projects();
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }

  const goProjectLink = (project_id) => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    if(workspaceId == null)
    {
      alert('Workspace is not set');
      return;
    }
    document.location.href = '/collab_project?ws=' + workspaceId + '&pr=' + project_id;
  }

  return (
    // <Card
    //   {...rest}
    //   className={clsx(classes.root, className)}
    // >
    //   <CardContent className={classes.content}>
    //     {/* <PerfectScrollbar> */}
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className = {classes.tablecell}>Project Name</TableCell>
                  <TableCell className = {classes.tablecell}>Description</TableCell>
                  <TableCell className = {classes.tablecell}>Created date</TableCell>
                  <TableCell className = {classes.tablecell}>Due date</TableCell>
                  <TableCell className = {classes.tablecell}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(project => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={project.id}
                  >
                    <TableCell className = {classes.tablecell}>
                      <div className={classes.nameContainer}>
                        {/* <Avatar
                          className={classes.avatar}
                          src={category.data.avatarUrl}
                        >
                          {getInitials(category.data.name)}
                        </Avatar> */}
                        <a style = {{color : '#00e', cursor : 'pointer', textDecorationLine : 'underline' }} onClick = {() => {goProjectLink(project.id)}}>{project.name}</a>
                      </div>
                    </TableCell>
                    <TableCell className = {classes.tablecell} style = {{ wordWrap: 'break-word', maxWidth : '200px'}}>{project.description}</TableCell>
                    <TableCell className = {classes.tablecell}>
                      {moment(project.createdAt).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell className = {classes.tablecell}>
                      {moment(project.due_date).format('YYYY-MM-DD HH:mm')}
                    </TableCell>
                    <TableCell className = {classes.tablecell}>
                      <Button
                        color='#151b26'
                        variant="outlined"
                        style = {{paddingLeft : '8px', paddingRight : '8px', minWidth: 'auto'}}
                        onClick = {() => onUpdate(project.id)}
                      >
                        <EditIcon style = {{width : 20, height : 20}}/>
                      </Button>
                      <Button
                        color='#151b26'
                        variant="outlined"
                        style = {{paddingLeft : '8px', paddingRight : '8px', minWidth: 'auto', marginLeft : 8}}
                        onClick = {() => onDelete(project.id)}
                      >
                        <DeleteIcon  style = {{width : 20, height : 20}}/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
    //     {/* </PerfectScrollbar> */}
    //   </CardContent>
      
    // </Card>
  );
};

MyProjectsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default MyProjectsTable;
