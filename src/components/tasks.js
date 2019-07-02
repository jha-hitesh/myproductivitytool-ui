import React from 'react';
import $ from 'jquery';
import { Redirect, Link } from 'react-router-dom';
import { Confirm } from 'semantic-ui-react'

import config from 'react-global-configuration';


class Tasks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'tasks': [],
      'showDeleteConfirmation': false,
      'currentTask': null
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
  }

  fetchTasks() {
    if (this.props.jwt){
      var component = this;
      $.ajax({
        url: config.get('backend')+'/api/tasks/view_active_multiple/',
        method: 'GET',
        data: {},
        headers: {
          Authorization: 'JWT '+ this.props.jwt
        },
        beforeSend: function () {
           $('.page-segment').addClass('loading');
        }
      }).done(function (data) {
        component.setState({tasks: data.results});
      }).fail(function (xhr, status, error) {
        if (xhr.status === 401){
          component.props.openMessageModal('ERROR','you have been logged out');
          component.props.signOut();
        }else{
          var message = 'Request could not be completed';
          if (xhr.responseJSON && xhr.responseJSON.message) {
            message = xhr.responseJSON.message;
          }
          component.props.openMessageModal('ERROR',message);
        }
      }).always(function (xhr, status) {
        $('.page-segment').removeClass('loading');
      });
    }
  }

  deleteTask(event) {
    var component = this;
    var url = config.get('backend')+'/api/tasks/'+this.currentTask+'/delete/';

    $.ajax({
      url: url,
      method: 'POST',
      data: {},
      headers: {
        Authorization: 'JWT '+ component.props.jwt
      },
      beforeSend: function () {
         $('.page-segment').addClass('loading');
      }
    }).done(function (data) {
      component.props.openMessageModal('SUCCESS', data.message);
      this.fetchTasks();
    }).fail(function (xhr, status, error) {
      if (xhr.status === 401){
        component.props.openMessageModal('ERROR','you have been logged out');
        component.props.signOut();
      }else{
        var message = 'Request could not be completed';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          message = xhr.responseJSON.message;
        }
        component.props.openMessageModal('ERROR',message);
      }
    }).always(function (xhr, status) {
      $('.page-segment').removeClass('loading');
    });
  }

  closeDeleteModal(event) {
    this.setState({'showDeleteConfirmation': false, 'currentTask': null});
  }

  componentWillMount() {
    this.fetchTasks();
  }

  render() {
    var tasks = this.state.tasks.map((task, id) => {
      var updateLink = '/tasks/'+task.id+'/update';
      var viewLink = '/tasks/'+task.id+'/view';

      var status = 'Draft';
      if (task.status === 'PRG'){
        status = 'In Progress';
      }else if (task.status === 'CMP'){
        status = 'Completed';
      }

      var priority = 'Low';
      if (task.priority === 'B'){
        priority = 'Medium';
      }else if (task.priority === 'C'){
        priority = 'High';
      }
      
      return (
        <div class='item'>
          <div class='right floated content'>
            <Link to={updateLink}><div class='ui button'>Update</div></Link>
            <div class='ui button' onClick={() => this.setState({'showDeleteConfirmation': true, 'currentTask': task.id})}>Delete</div>
          </div>
          <i class="large tasks middle aligned icon"></i>
          <div class='content'>
            <div class='header'><Link to={viewLink}>{task.name}</Link> ({priority}) ({status})</div>
            <div class='description'>{task.startDate} To {task.endDate}</div>
          </div>
        </div>
      );
    });
    if (this.props.jwt){
      return (
        <div className='Tasks'>
          <div class='ui hidden divider'></div>  
          <h2 class='ui center aligned icon header'>
            <i class='circular tasks icon'></i>
            Tasks
          </h2>
          <div className='ui center aligned'>  
            <Link to='/tasks/add'><div class='ui button' >Add Task</div></Link>
          </div>
          <div class='ui clearing divider'></div>  
          <Confirm header='Delete Task?' open={this.state.showDeleteConfirmation} onCancel={this.closeDeleteModal} onConfirm={this.deleteTask} />
          <div class='ui middle aligned divided list vertical-scrolling-content'>
            {tasks}
          </div>
        </div>
      );
    }else {
      return <Redirect to='/'/>;
    }
  }  
}

export default Tasks;
