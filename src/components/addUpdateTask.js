import React from 'react';
import $ from 'jquery';
import config from 'react-global-configuration';
import { Dropdown } from 'semantic-ui-react'


class AddUpdateTask extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      'name': '',
      'description': '',
      'startDate': '',
      'endDate': '',
      'project': '',
      'status': 'DRF',
      'priority': 'A',
      'context': {},
      'statusChoices': [
        {
          'key': 'DRF',
          'value': 'DRF',
          'text': 'Drafted'
        },
        {
          'key': 'PRG',
          'value': 'PRG',
          'text': 'In Progress'
        },
        {
          'key': 'CMP',
          'value': 'CMP',
          'text': 'Completed'
        }
      ],
      'priorityChoices': [
        {
          'key': 'A',
          'value': 'A',
          'text': 'Low'
        },
        {
          'key': 'B',
          'value': 'B',
          'text': 'Medium'
        },
        {
          'key': 'C',
          'value': 'C',
          'text': 'High'
        }
      ]
    }
    this.saveTask = this.saveTask.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]:event.target.value});
  }

  handleDropdownChange(event, data){
    this.setState({[data.name]:data.value});
  }
  
  saveTask() {
    var component = this;
    var url = '/api/tasks/add/';
    if (component.props.match.params.tid){
      url = '/api/tasks/'+component.props.match.params.tid+'/update/'
    }
    url = config.get('backend')+url;

    var formData = new FormData();
    formData.append('name', component.state.name);
    formData.append('description', component.state.description);
    formData.append('startDate', component.state.startDate);
    formData.append('endDate', component.state.endDate);
    
    if (component.state.project){
      formData.append('project', component.state.project);
    }
    formData.append('status', component.state.status);
    formData.append('priority', component.state.priority);
    

    $.ajax({
      url: url,
      method: 'POST',
      data: formData,
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      headers: {
        Authorization: 'JWT '+ component.props.jwt
      },
      beforeSend: function () {
         $('.page-segment').addClass('loading');
      }
    }).done(function (data) {
      component.props.openMessageModal('SUCCESS',data.message);
      if (component.props.match.params.pid){
        component.props.history.push('/projects/'+component.props.match.params.pid+'/view');
      }else{
        component.props.history.push('/tasks');
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

  fetchTask() {
    var component = this;
    var url = '/api/tasks/get_context/';
    if (component.props.match.params.tid){
      url = '/api/tasks/'+component.props.match.params.tid+'/get_context/'
    }
    url = config.get('backend')+url;
    
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
      component.setState({'context': data.context});
      if (data.context.instance){
        component.setState({'name': data.context.instance.name});
        component.setState({'description': data.context.instance.description});
        component.setState({'startDate': data.context.instance.startDate});
        component.setState({'endDate': data.context.instance.endDate});
        component.setState({'assignee': data.context.instance.assigneeID});
        component.setState({'project': data.context.instance.projectId});
        component.setState({'status': data.context.instance.status});
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

  componentWillMount() {
    this.fetchTask();
  }
  render() {
    var pageTitle = this.props.match.params.tid ? 'Update Task' : 'Add Task';
    return (
      <form className='ui form'>
        <div className='ui hidden divider'></div>
        <h3 className='ui header'>{pageTitle}</h3>
        <div className='ui clearing divider'></div>
        <div className='required field'>
        <label>Task Name</label>
        <input type='text' name='name' value={this.state.name} placeholder='Task Name' onChange={this.handleChange}></input>
        </div>
        <div className='required field'>
        <label>Description</label>
        <textarea name='description' value={this.state.description} onChange={this.handleChange} placeholder='Task Description'></textarea>
        </div>
        <div className='required field'>
        <label>Start Date</label>
        <input type='date' name='startDate' value={this.state.startDate} placeholder='Start Date' onChange={this.handleChange}></input>
        </div>
        <div className='required field'>
        <label>End Date</label>
        <input type='date' name='endDate' value={this.state.endDate} placeholder='End Date' onChange={this.handleChange}></input>
        </div>
        <div className='field'>
        <label>Project</label>
        <Dropdown placeholder='Select Project' name='project' value={this.state.project} fluid selection options={this.state.context.projects} onChange={this.handleDropdownChange} />
        </div>

        <div className='required field'>
        <label>Task Status</label>
        <Dropdown placeholder='Select Task Status' name='status' value={this.state.status} fluid selection options={this.state.statusChoices} onChange={this.handleDropdownChange} />
        </div>

        <div className='required field'>
        <label>Task Priority</label>
        <Dropdown placeholder='Select Task Priority' name='priority' value={this.state.priority} fluid selection options={this.state.priorityChoices} onChange={this.handleDropdownChange} />
        </div>
      
        <button className='ui button' type='button' onClick={this.saveTask}>Save</button>
      </form>
    );
  }
}

export default AddUpdateTask;
