import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Avatar,
    Grid,
    Button,
    IconButton,
} from '@material-ui/core';
import {AddOutlined, ArrowDropDown, ArrowDropUp, MoreHoriz} from '@material-ui/icons';
import {config, _http, _sessionStorage, _auth_check, _crypto, _localStorage, getInitials, _date_helper} from 'helpers';
import MenuButton from './MenuButton';

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '#fff',
    boxShadow: '1px 1px 1px 1px rgba(111, 111, 111, .28)',
    borderRadius: 4,
    // styles we need to apply on draggables
    ...draggableStyle
});


export default class BoardItem extends Component {
    constructor (props) {
        super(props);
        this.props = props;
        this.state = {
            task_item : this.props.task_item,
            index : this.props.index
        }
    }

    UNSAFE_componentWillReceiveProps (props) {
        this.props = props;
        this.setState({
            task_item : this.props.task_item,
            index : this.props.index
        })
    }

    onEditSection = () => {
        this.props.onUpdate(this.state.task_item);
    }

    onDeleteSection = () => {
        this.props.onDelete(this.state.task_item);
    }

    render() {
        let task_item = this.state.task_item;
        let index = this.state.index;
        return (
            <Draggable
                key={task_item.id}
                draggableId={task_item.id}
                index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                        )}>
                        <div style = {{display : 'flex', alignItems : 'center'}}>
                            <div  style={{fontSize : 14}}>{task_item.name}</div>
                            <span style = {{flex : 1}}></span>
                            <MenuButton btn_style = 'task' onEdit = {this.onEditSection} onDel = {this.onDeleteSection}/>
                        </div>
                        
                        <div style = {{display : 'flex', alignItems : 'center', marginTop: 8 }}>
                            <Avatar
                                style = {{width : '20px', height : '20px'}}
                                src={task_item.assignee == null || task_item.assignee.photo == null ? '' : task_item.assignee.photo.original}
                            >
                                <span style = {{fontSize : 14}}>
                                {task_item.assignee == null || task_item.assignee.photo == null ? ''
                                :  getInitials(task_item.assignee.first_name + ' ' + task_item.assignee.last_name)}
                                </span>
                            </Avatar>
                            <div style={{marginLeft : '10px'}}>
                                {/* <div style={{fontSize : 14}}>{'Aug 29'}</div>  */}
                                <div style={{fontSize : 14}}>{task_item.assignee.first_name + ' ' + task_item.assignee.last_name}</div>
                                {/* <div>{member.email}</div> */}
                            </div>
                            <div style={{flex : 1}}></div>
                            <div style={{fontSize : 14}}>{_date_helper.getDateString(task_item.due_date)}</div>
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }
}

