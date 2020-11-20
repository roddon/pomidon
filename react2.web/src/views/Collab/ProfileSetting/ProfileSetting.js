import React from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Profile from './Components/Profile';
import Notification from './Components/Notification';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo1: {
    width : '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));


const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#1890ff',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$selected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const ProfileSetting = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const tab_names = ["Profile", "Notification"];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <div className={classes.demo1}>
          <AntTabs value={value} onChange={handleChange} aria-label="ant example">
            <AntTab label="Profile" />
            <AntTab label="Notification" />
          </AntTabs>
          {
            value == 0?
            <Profile />
            :
            null
          }
          {
            value == 1?
            <Notification />
            :
            null
          }
        </div>
      </Grid>
    </div>
  );
};

export default ProfileSetting;
