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
import {_sessionStorage, _http, getInitials} from 'helpers';

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

const InvitedProjectsTable = props => {
  const { className, onUpdate, onDelete, ...rest } = props;

  const classes = useStyles();
  const [projects, setProjects] = useState([]);

  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
    get_invited_projects();
  }, []);

  const get_invited_projects = () => {
    _http.doPost('collab/get_invited_project', 
      { 
        user_id : registered_user.id
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
  
  const goInvitedProjectPage = (project) => {
    document.location.href = '/collab_invited_project?ws=' + project.invite_project.workspace_id
         + '&pr=' + project.invite_project.project_id + '&u=' + project.owner.id;
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
                  <TableCell className = {classes.tablecell}>Project Description</TableCell>
                  <TableCell className = {classes.tablecell}>Due date</TableCell>
                  <TableCell className = {classes.tablecell}>Owner</TableCell>
                  <TableCell className = {classes.tablecell}>Invite date</TableCell>
                </TableRow>
              </TableHead>
              {
                projects.length > 0 ?
                <TableBody>
                  {projects.map(project => (
                    <TableRow
                      className={classes.tableRow}
                      hover
                      key={project.id}
                    >
                      <TableCell className = {classes.tablecell}>
                        <span   style = {{marginLeft: 20, cursor : 'pointer', color : '#23f', textDecorationLine : 'underline'}} 
                            onClick = {() => goInvitedProjectPage(project)}>
                              {project.invite_project.project_name}
                        </span>
                      </TableCell>
                      <TableCell className = {classes.tablecell}>{project.invite_project.project_description}</TableCell>
                      <TableCell className = {classes.tablecell}>
                        {moment(project.invite_project.project_due_date).format('YYYY-MM-DD HH:mm')}
                      </TableCell>
                      <TableCell className = {classes.tablecell}>
                        <div style = {{display : 'flex', alignItems : 'center', marginLeft: 6 }}>
                          <Avatar
                            style = {{width : '50px', height : '50px'}}
                            src={project.owner.photo.original}
                          >
                            {getInitials(project.owner.first_name + ' ' + project.owner.last_name)}
                          </Avatar>
                          <div style={{marginLeft : '20px'}}>
                            <div>{project.owner.first_name + ' ' + project.owner.last_name}</div>
                            <div>{project.owner.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className = {classes.tablecell}>
                        {moment(project.invite_date).format('YYYY-MM-DD HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                : 
                <TableBody>
                  <TableCell />
                  <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center',width : '100%', }}>
                    <p style = {{marginLeft : 8, fontSize : 14, width : '100%', textAlign : 'center'}}>No invited projects</p>
                  </div>  
                  <TableCell />
                </TableBody>
                
              }
              
            </Table>
          </div>
    //     {/* </PerfectScrollbar> */}
    //   </CardContent>
      
    // </Card>
  );
};

InvitedProjectsTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default InvitedProjectsTable;
