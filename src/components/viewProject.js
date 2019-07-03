import React from 'react';
import $ from 'jquery';
import { Redirect, Link } from 'react-router-dom';
import { Confirm } from 'semantic-ui-react';

import config from 'react-global-configuration';


class ViewProject extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'project': {},
      'tasks': [],
      'showDeleteConfirmation': false,
      'currentTask': null,
      'currentProject': null,
    };
    this.fetchProject = this.fetchProject.bind(this);
    this.deleteProjectAndTask = this.deleteProjectAndTask.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
  }

  fetchProject() {
    var component = this;
    var url = config.get('backend')+'/api/projects/'+component.props.match.params.pid+'/view/'
        
    $.ajax({
      url: url,
      method: 'GET',
      data: {},
      headers: {
        Authorization: 'JWT '+ component.props.jwt
      },
      beforeSend: function () {
         $('.page-segment').addClass('loading');
      }
    }).done(function (data) {
      component.setState({'project': data.result});
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


  deleteProjectAndTask(event) {
    var component = this;
    var deleteType = null;
    var url = undefined;
    if (this.state.currentProject){
      deleteType = 'project';
      url = config.get('backend')+'/api/projects/'+this.state.project.id+'/delete/';
    }else if (this.state.currentTask){
      deleteType = 'task';
      url = config.get('backend')+'/api/projects/'+this.state.project.id+'/tasks/'+this.state.currentTask+'/delete/';
    }else{
      return
    }

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
      component.closeDeleteModal();
      component.props.openMessageModal('SUCCESS', data.message);
      if (deleteType === 'project'){
        component.props.history.push('/projects');
      }else{
        component.fetchProjectTasks();
      }
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

  fetchProjectTasks() {
    var component = this;
    var url = config.get('backend')+'/api/projects/'+component.props.match.params.pid+'/tasks/view_active_multiple/';
        
    $.ajax({
      url: url,
      method: 'GET',
      data: {},
      headers: {
        Authorization: 'JWT '+ component.props.jwt
      },
      beforeSend: function () {
         $('.page-segment').addClass('loading');
      }
    }).done(function (data) {
      component.setState({'tasks': data.results});
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
    this.setState({'showDeleteConfirmation': false, 'currentProject': null, 'currentTask': null});
  }

  componentWillMount() {
    this.fetchProject();
    this.fetchProjectTasks();
  }

  render() {
    if (this.props.jwt){
      var updateLink = '/projects/'+this.state.project.id+'/update';
      var addTaskLink = '/projects/'+this.state.project.id+'/tasks/add';
      var tasks = this.state.tasks.map((task, id) => { 
        var taskUpdateLink = '/projects/'+this.state.project.id+'/tasks/'+task.id+'/update';
        var taskViewLink = '/projects/'+this.state.project.id+'/tasks/'+task.id+'/view';

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
              <Link to={taskUpdateLink}><div class='ui small button'>Update</div></Link>
              <div class='ui small button' onClick={() => this.setState({'showDeleteConfirmation': true, 'currentTask': task.id})}>Delete</div>
            </div>
            <i class='large middle aligned tasks icon'></i>
            <div class='content'>
              <div class='header'><Link to={taskViewLink}>{task.name}</Link> ({priority}) ({status})</div>
              <div class='description'>{task.startDate} To {task.endDate}</div>
            </div>
          </div>
        );
      });
      return (
        <div className='Project'>
          <div class='ui hidden divider'></div>  
          <h2 class='ui center aligned icon header'>
            <i class='circular suitcase icon'></i>
            <div className='ui hidden divider'></div>
            {this.state.project.name}
          </h2>
          <div class='ui clearing divider'></div>
          <div className='ui center aligned'>  
            <Link to={updateLink}><div class='ui button'>Update</div></Link>
            <div class='ui button' onClick={() => this.setState({'showDeleteConfirmation': true, 'currentProject': this.state.project.id})}>Delete</div>
            <Link to={addTaskLink}><div class='ui button'>Add Task</div></Link>
          </div>
          <div class='ui clearing divider'></div>  
          <Confirm header='Delete?' open={this.state.showDeleteConfirmation} onCancel={this.closeDeleteModal} onConfirm={this.deleteProjectAndTask} />
          <div className='ui stackable grid'>
            <div className='eight wide column'>
              <div className='ui message'>
              <h4 className='ui header'>Project Description</h4>
              <div class='ui hidden divider'></div>  
              {this.state.project.description}
              <div class='ui hidden divider'></div>
              <h5 className='ui header'>Project Created On: {this.state.project.createdOn}</h5>
              <h5 className='ui header'>Project Last Modified: On {this.state.project.lastModifiedOn}</h5>
              </div>
            </div>
            <div className='eight wide column'>
              <h4 className='ui header'>Project Tasks</h4>
              <div class='ui middle aligned divided list vertical-scrolling-content'>
                {tasks}
              </div>
            </div>

          </div>
        </div>
      );
    }else {
      return <Redirect to='/'/>;
    }
  }  
}

export default ViewProject;
