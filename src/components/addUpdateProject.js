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
      'avatar': '',
      'avatarPreview': null,
      'keepPreviousAvatar': false,
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
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleCalendar = this.handleCalendar.bind(this);
    this.saveProject = this.saveProject.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
  }

  handleChange(event) {
    if (event.target.name === 'avatar'){
      this.setState({[event.target.name]: event.target.files[0]});
      this.setState({'avatarPreview': event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : null});
      this.setState({'keepPreviousAvatar': false});
    }else{
      this.setState({[event.target.name]:event.target.value});
    }
  }

  handleDropdownChange(event, data){
    this.setState({[data.name]:data.value});
  }

  handleCalendar(event){
    this.setState({[event.target.name]:event.target.value});
  }

  handleCheckbox(event) {
    var component = this;
    if (!component.state.keepPreviousAvatar){
      component.setState({'avatar': ''});
      component.setState({'avatarPreview': null});
      console.log($('input[name=avatar]'));
      $('input[name=avatar]')[0].value=null;
    }
    component.setState({'keepPreviousAvatar': !component.state.keepPreviousAvatar});
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
    formData.append('avatar', component.state.avatar);
    formData.append('keepPreviousAvatar', component.state.keepPreviousAvatar ? 'yes' : 'no');

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
        component.setState({'keepPreviousAvatar': data.context.instance.hasAvatar})
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
    var keepPreviousAvatarCheckbox = <Checkbox label={{ children: 'Keep Previous Avatar?' }} checked={this.state.keepPreviousAvatar} name='keepPreviousAvatar' value='yes' onChange={this.handleCheckbox}/>
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
        <div className='two fields'>
          <div className='field'>
          <label>Project Avatar (keep It under 70x70)</label>
          <input type='file' name='avatar' onChange={this.handleChange}></input>
          </div>
          {this.state.context.instance && this.state.context.instance.hasAvatar && 
            <div className='field'>
            {keepPreviousAvatarCheckbox}
            </div>
          }
        </div>
      {this.state.avatarPreview && 
        <div className='field'>
          <label>Project Avatar Preview</label>
          <img src={this.state.avatarPreview} alt='Avatar Preview'></img>
        </div>
      }
        <button className='ui button' type='button' onClick={this.saveProject}>Save</button>
      </form>
    );
  }
}

export default AddUpdateProject;
