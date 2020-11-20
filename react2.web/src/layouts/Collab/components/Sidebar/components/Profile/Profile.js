import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import {config, _http, _sessionStorage} from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content',
    marginBottom : '10px'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1),
    fontSize : '12px',
    color : '#fff'
  }
}));

const Profile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  let registered_user = _sessionStorage.getItem('user');
  const user = {
    name:  registered_user.first_name + ' ' +  registered_user.last_name,
    avatar:  registered_user.photo == null || registered_user.photo.thumbnail == null ? '/images/avatars/empty.png' : registered_user.photo.thumbnail,
    // bio: 'Brain Director'
  };

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={user.avatar}
        // to="/settings"
      />
      <div
        className={classes.name}
      >
        {user.name}
      </div>
      {/* <Typography variant="body2">{user.bio}</Typography> */}
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
