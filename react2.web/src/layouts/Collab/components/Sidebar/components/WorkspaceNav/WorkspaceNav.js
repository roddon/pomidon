/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';
import {LabelImportant} from '@material-ui/icons';
import {_url_helper} from 'helpers';
import {_sessionStorage, _http} from 'helpers';
import * as qs from 'query-string';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: '#eee',
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: '#aaa',
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: '#000',
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: '#000'
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const WorkspaceNav = props => {
  const { pages, className, cur_workspace, projects,onSelectProject, ...rest } = props;

  const classes = useStyles();

  let cur_href =  document.location.href;
  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
  }, []);
  
  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      <ListItem
          className={classes.item}
          disableGutters
          style = {{marginBottom : '16px'}}
        >
        <div style={{fontSize : '14px', marginLeft : '10px'}}>{cur_workspace == null ? 'no workspace' : cur_workspace.name}</div>
      </ListItem>
      {projects.map(project => (
        <ListItem
          className={classes.item}
          disableGutters
          key={project.id}
        >
          <Button
            activeclassname={classes.active}
            className={classes.button}
            onClick = {() => {onSelectProject(project)}}
            style = {cur_href.includes(project.id) == true ? {backgroundColor : '#ffffff44', color : '#fff'} : {}}
          >
            <LabelImportant style = {{fontSize : '16px', marginRight : 4}} />
            {project.name}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

WorkspaceNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default WorkspaceNav;
