import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Paper, Input, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(1),
    display: 'flex',
    flexBasis: 420
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px'
  }
}));

const ConfirmDialog = props => {
  const {open, onOk, onCancel,title, className, onChange, style, ...rest } = props;

  const classes = useStyles();

  return (
    <Dialog
      {...rest}
      className={clsx(classes.root, className)}
      
      style={style}
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {title}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onOk} color="primary">
          OK
        </Button>
        <Button onClick={onCancel} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open : PropTypes.bool,
  title : PropTypes.string,
  onOk : PropTypes.bool,
  onCancel : PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object
};

export default ConfirmDialog;
