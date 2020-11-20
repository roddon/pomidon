import React, { Component } from "react";
import './style.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import {
    Button
  } from '@material-ui/core';

export default class LoadingButton extends Component {

    constructor(props)
    {
      super(props);
      this.props = props;
      this.state = {
        loading: this.props.loading,
        label : this.props.label,
        label_loading : this.props.label_loading,
      }
    }

    UNSAFE_componentWillReceiveProps = (props) => {
        this.props = props;
        this.setState({
          loading: this.props.loading,
          label : this.props.label,
          label_loading : this.props.label_loading,
        });
    }

    render() {
        const { loading } = this.state;
        return (
            <Button type = "submit" color="primary" variant = "contained" className="button" style = {this.props.style == null? {}: this.props.style} onClick={this.props.onClick} disabled={loading}>
              {loading && (
                  <Loader  type="Oval" color="#FFF" height={20} width={20}/>
              )}
              {loading && <span style ={{marginLeft : '15px'}}>{this.state.label_loading}</span>}
              {!loading && <span >{this.state.label}</span>}
            </Button>
        );
    }
}
