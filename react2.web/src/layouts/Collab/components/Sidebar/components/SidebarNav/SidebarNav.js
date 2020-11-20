/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, useState, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';
import {_url_helper, _http, _sessionStorage} from 'helpers';

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

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();
  const [unread_inboxes, setUnreadInboxes] = useState(0);
  let registered_user = _sessionStorage.getItem('user');

  useEffect(() => {
    get_inboxes();
  }, []);

  const get_inboxes = () => {
    _http.doPost('collab/get_inboxes', 
      { 
        user_id : registered_user.id,
        inbox_status : 'active'
      }, 
      (data) => {
        if(data.status == false)
        {
          alert(data.data);
        }
        else
        {
          setUnreadInboxes(data.data.length)
        }
      },
      (err) => {
        console.log(err);
        alert('Error occured');
      }
    );
  }
  let cur_href =  document.location.href;

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        <ListItem
          className={classes.item}
          disableGutters
          key={page.title}
        >
          <Button
            activeclassname={classes.active}
            className={classes.button}
            // component={CustomRouterLink}
            // to={page.href}
            onClick = {() => {_url_helper.goToPage(document.location.href, page.href)}}
            style = {cur_href.includes(page.href) == true ? {backgroundColor : '#cbd4db', color : '#000'} : {}}
          >
            <div className={classes.icon} style = {cur_href.includes(page.href) == true ? {color : '#000'} : {}}>{page.icon}</div>
            {page.title}
            <div style={{flex: 1}}></div>
            {
              page.title == 'Inbox' && unread_inboxes > 0 ?
              <div style = {{color : '#fff', backgroundColor : '#f00', borderRadius : 20, borderRadius: '20px',
              height: '20px',width: '20px',textAlign : 'center', lineHeight : '20px'}}>{unread_inboxes}</div>
              :null
            }
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
