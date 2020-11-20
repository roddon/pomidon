import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';
import {LoadingButton, PageLoading} from 'components'
import { Sidebar, Topbar, Footer } from './components';
import {config, _http, _sessionStorage, _auth_check} from 'helpers';
import {Button, DialogTitle, Dialog, DialogActions, DialogContent, DialogContentText, TextField, } from '@material-ui/core';
import * as qs from 'query-string';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  shiftContent: {
    paddingLeft: 240
  },
  unshiftContent: {
    paddingLeft: 0
  },
  content: {
    height: '100%',
    width : '100%'
  },
  content_with_sidebar : {
    height: '100%',
    width : '100%',
    // width : 'calc(100% - 240px)'
  }
}));

const get_cur_page = () => {
  if(document.location.href.includes('collab_dashboard') == true){
    return 'Dashboard';
  }
  else if(document.location.href.includes('collab_mytasks') == true){
    return 'My Projects';
  }
  else if(document.location.href.includes('collab_inbox') == true){
    return 'Inbox';
  }
  else if(document.location.href.includes('collab_setting') == true){
    return 'My Profile Setting';
  }
  else if(document.location.href.includes('collab_addproject') == true){
    return 'Add project';
  }
  else if(document.location.href.includes('collab_editproject') == true){
    return 'Edit project';
  }
  else if(document.location.href.includes('collab_project') == true){
    return 'Project Page';
  }
  
}


const Collab = props => {
  const { children , cur_module} = props;
  const classes = useStyles();
  const theme = useTheme();
  // const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
  //   defaultMatches: true
  // });

  const [pageLoaded, setPageLoad] = useState(false);
  const [isDesktop, setDesktop] = useState(true);
  const [openSidebar, setOpenSidebar] = useState(isDesktop ? true : false);
  const [workspace_name, setWorkspaceName] = useState('');
  const [isWDialog, openWDialog] = useState(false);
  const [isConfirmDialog, openConfrimDialog] = useState(false);
  const [cur_workspace, setCurWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [cur_project, setCurProject] = useState(null);

  let registered_user = _sessionStorage.getItem('user');
  let cur_page = get_cur_page();

  useEffect(() => {
    get_auth_status();
    get_workspaces();
    get_cur_workspace();
    get_cur_project();
    function handleResize() {
      if(window.innerWidth < 1024)
      {
        setDesktop(false);
        setOpenSidebar(false);
      }
      else
      {
        setDesktop(true);
        setOpenSidebar(true);
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const get_auth_status =  () => {
    if(registered_user != null)
    {
      setPageLoad(true);
    }
    else {
      document.location.href = '/';
    }
  }
  
  const get_workspaces = () => {
    _http.doPost('collab/get_workspace', 
      { 
        user_id : registered_user.id
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data)
        }
        else
        {
          setWorkspaces(data.data);
        }
      },
      (err) => {
        alert('Error is occured while getting workspaces');
        console.log('Error occured', err);
      }
    );
  }

  
  const get_cur_workspace = () => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    if(workspaceId == null)
    {
      setCurWorkspace(null);
    }
    else
    {
      _http.doPost('collab/get_one_workspace', 
        { 
          user_id : registered_user.id,
          workspace_id : workspaceId
        }, 
        (data) => {
          if(data.status == false)
          {
            alert(data.data)
          }
          else
          {
            setCurWorkspace(data.data);
            get_curworkspace_projects(data.data.id);
          }
        },
        (err) => {
          setCurWorkspace(null);
          alert('Error is occured while getting current workspace');
          console.log('Error occured', err);
        }
      );
    }
  }

  const get_cur_project = () => {
    const parsed = qs.parse(document.location.search);
    let workspaceId = parsed.ws;
    let projectID = parsed.pr;
    if(workspaceId == null)
    {
      setCurWorkspace(null);
    }
    else if (projectID == null)
    {
      setCurProject(null);
    }
    else
    {
      _http.doPost('collab/get_project_detail', 
        { 
          user_id : registered_user.id,
          workspace_id : workspaceId,
          project_id : projectID
        }, 
        (data) => {
          if(data.status == false)
          {
            alert(data.data)
          }
          else
          {
            setCurProject(data.data);
          }
        },
        (err) => {
          alert('Error is occured while getting current workspace');
          console.log('Error occured', err);
        }
      );
    }
  }
  
  const get_curworkspace_projects = (workspace_id) => {

    _http.doPost('collab/get_project', 
      { 
        user_id : registered_user.id,
        workspace_id : workspace_id
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

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const onCreate = () => {
    if(workspace_name == '')
    {
      return;
    }

    _http.doPost('collab/creat_workspace', 
      { 
        user_id : registered_user.id,
        workspace_name : workspace_name
      }, 
      (data) => {
        if(data.status == false)
        {
          openWDialog(false);
          alert(data.data);
        }
        else
        {
          get_workspaces();
          openWDialog(false);
        }
      },
      (err) => {
        openWDialog(false);
        alert('Error is occured while creating a workspace');
        console.log('Error occured', err);
      }
    );
  }

  const onRemove = () => {
    if(cur_workspace == null || cur_workspace.id == null)
    {
      openConfrimDialog(false);
      return;
    }

    _http.doPost('collab/delete_workspace', 
      { 
        user_id : registered_user.id,
        workspace_id : cur_workspace.id
      }, 
      (data) => {
        if(data.status == false)
        {
          openConfrimDialog(false);
          alert(data.data);
        }
        else
        {
          get_workspaces();
          for(var i = 0; i < workspaces.length; i ++)
          {
            if(workspaces[i].id != cur_workspace.id)
            {
              document.location.href = '/collab_dashboard?ws=' + workspaces[i].id;
              break;
            }
          }
          openConfrimDialog(false);
        }
      },
      (err) => {
        openConfrimDialog(false);
        alert('Error is occured while deleting this workspace');
        console.log('Error occured', err);
      }
    );
  }

  const handleClose = () => {
    openWDialog(false);
  }

  const handleConfirmClose = () => {
    openConfrimDialog(false);
  }

  
  const onSelectProject = (project) => {
      if(cur_workspace == null)
      {
        alert('Workspace is not set');
        return;
      }
      if(project == null)
      {
        alert('project is not set');
        return;
      }
      setCurProject(project);
      document.location.href = '/collab_project?ws=' + cur_workspace.id + '&pr=' + project.id;
  }

  return (
    (
      pageLoaded == false ?
      <PageLoading />
      :
      <div
        className={clsx({
          [classes.root]: true,
          [classes.shiftContent]: openSidebar
        })}
      >
        <Sidebar
          onClose={handleSidebarClose}
          open={openSidebar}
          cur_module = {cur_module}
          cur_workspace = {cur_workspace}
          projects = {projects}
          variant={isDesktop ? 'persistent' : 'temporary'}
          onSelectProject = {onSelectProject}
        />
        <main className={openSidebar ?  classes.content_with_sidebar : classes.content } >
          <Topbar 
            cur_page = {cur_page} 
            cur_project = {cur_project}
            open={openSidebar} 
            onSidebarOpen = {handleSidebarOpen} 
            onCreateNewWorkSpace = {() => {openWDialog(true);}}
            onDeleteWorkSpace = {() => {openConfrimDialog(true);}}
            workspaces = {workspaces}
            cur_workspace = {cur_workspace}
            />
          {children}
          {/* <Footer /> */}
        </main>
        <Dialog disableBackdropClick disableEscapeKeyDown open={isWDialog} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add a new Workspace</DialogTitle>
          <DialogContent style = {{alignItems : 'flex-start', width : '400px'}} >
            {/* <DialogContentText>
              Please input category name and short description.
            </DialogContentText> */}
            <TextField
              autoFocus
              margin="dense"
              id="workspace_name"
              label="Workspace Name"
              type="text"
              value = {workspace_name}
              onChange = {event => setWorkspaceName(event.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            <Button onClick={onCreate} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog disableBackdropClick disableEscapeKeyDown open={isConfirmDialog} onClose={handleConfirmClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Remove Yourself from the Workspace?</DialogTitle>
          <DialogContent style = {{alignItems : 'flex-start', width : '400px'}} >
            <DialogContentText>
              If you remove yourself, you won't be able to access any of the projects or tasks in  
              <b> {
                cur_workspace == null? '' : cur_workspace.name
              }</b>
              . 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmClose} color="primary">
              Cancel
            </Button>
            <Button onClick={onRemove} color="primary">
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
   
  );
};

Collab.propTypes = {
  children: PropTypes.node
};

export default Collab;
