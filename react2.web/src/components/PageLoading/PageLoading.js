import React, { Component } from "react";

export default class PageLoading extends Component {

    constructor(props)
    {
      super(props);
      this.props = props;
    }

    render() {
        return (
          <div style = {{display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', height : '100%'}}>
            <img src = "/images/system/loading_64x64.gif" 
              style = {{
                width :  this.props.width == null? 64 : this.props.width,
                height : this.props.height == null? 64 : this.props.height
              }}/>
          </div>
        );
    }
}
