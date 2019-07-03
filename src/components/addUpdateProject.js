import React from 'react';
import $ from 'jquery';
import config from 'react-global-configuration';
import { Checkbox, Dropdown } from 'semantic-ui-react';

class AddUpdateProject extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      'name': '',
      'description': '',
      'startDate': '',
      'endDate': '',
      'context': {},
      'statusChoices': [
        {
          'key': 'UPC',
          'value': 'UPC',
          'text': 'Upcoming'
        },
        {
          'key': 'ONG',
          'value': 'ONG',
          'text': 'Ongoing'
        },
        {
          'key': 'CMP',
          'value': 'CMP',
          'text': 'Completed'
        }
      ]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleCalendar = this.handleCalendar.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]:event.target.value});
  }

  handleDropdownChange(event, data){
    this.setState({[data.name]:data.value});
  }

  handleCalendar(event){
    this.setState({[event.target.name]:event.target.value});
  }
  
  saveProject() {
    var component = this;
    var url = '/api/projects/add/';
    if (component.props.match.params.pid){
      url = '/api/projects/'+component.props.match.params.pid+'/update/'
    }
    url = config.get('backend')+url;

    var formData = new FormData();
    formData.append('name', component.state.name);
    formData.append('description', component.state.description);
    formData.append('startDate', component.state.startDate);
    formData.append('endDate', component.state.endDate);
    formData.append('status', component.state.status);

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
      component.props.history.push('/projects');
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

  fetchProject() {
    var component = this;
    var url = '/api/projects/get_context/';
    if (component.props.match.params.pid){
      url = '/api/projects/'+component.props.match.params.pid+'/get_context/'
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
    this.fetchProject();
  }
  render() {
    var pageTitle = this.props.match.params.pid ? 'Update Project' : 'Add Project';
    return (

      <form className='ui form'>
        <div className='ui hidden divider'></div>
        <h3 className='ui header'>{pageTitle}</h3>
        <div className='ui clearing divider'></div>
        <div className='required field'>
        <label>Project Name</label>
        <input type='text' name='name' value={this.state.name} placeholder='Project Name' onChange={this.handleChange}></input>
        </div>
        <div className='required field'>
        <label>Description</label>
        <textarea name='description' value={this.state.description} onChange={this.handleChange} placeholder='Project Description'></textarea>
        </div>
        <div className='required field'>
        <label>Start Date</label>
        <input type='date' name='startDate' value={this.state.startDate} placeholder='Start Date' onChange={this.handleChange}></input>
        </div>
        <div className='required field'>
        <label>End Date</label>
        <input type='date' name='endDate' value={this.state.endDate} placeholder='End Date' onChange={this.handleChange}></input>
        </div>
        <div className='required field'>
        <label>Project Status</label>
        <Dropdown placeholder='Select Project Status' name='status' value={this.state.status} fluid selection options={this.state.statusChoices} onChange={this.handleDropdownChange} />
        </div>
        <button className='ui button' type='button' onClick={this.saveProject}>Save</button>
      </form>
    );
  }
}

export default AddUpdateProject;
