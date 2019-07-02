import React from 'react';
import $ from 'jquery';
import { Redirect, Link } from 'react-router-dom';
import { Confirm } from 'semantic-ui-react'

import config from 'react-global-configuration';


class Projects extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'projects': [],
      'showDeleteConfirmation': false,
      'currentProject': null
    };
    this.fetchProjects = this.fetchProjects.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
  }

  fetchProjects() {
    if (this.props.jwt){
      var component = this;
      $.ajax({
        url: config.get('backend')+'/api/projects/view_active_multiple/',
        method: 'GET',
        data: {},
        headers: {
          Authorization: 'JWT '+ this.props.jwt
        },
        beforeSend: function () {
           $('.page-segment').addClass('loading');
        }
      }).done(function (data) {
        component.setState({projects: data.results});
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

  deleteProject(event) {
    var component = this;
    var url = config.get('backend')+'/api/projects/'+this.currentProject+'/delete/';

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
      this.fetchProjects();
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
    this.setState({'showDeleteConfirmation': false, 'currentProject': null});
  }

  componentWillMount() {
    this.fetchProjects();
  }

  render() {
    var projects = this.state.projects.map((project, id) => {
      var avatar = 'suitcase icon';
      var updateLink = '/projects/'+project.id+'/update';
      var viewLink = '/projects/'+project.id+'/view';
      var status = 'Ongoing';
      if (project.status === 'UPC'){
        status = 'Upcoming';
      }else if (project.status === 'CMP'){
        status = 'Completed';
      }
      if (project.avatar){
        avatar = project.avatar;
      }
      return (
        <div class='item'>
          <div class='right floated content'>
            <Link to={updateLink}><div class='ui button'>Update</div></Link>
            <div class='ui button' onClick={() => this.setState({'showDeleteConfirmation': true, 'currentProject': project.id})}>Delete</div>
          </div>
          <img class='ui avatar image' src={avatar} alt='avatar'></img>
          <div class='content'>
            <div class='header'><Link to={viewLink}>{project.name}</Link> ({status})</div>
            <div class='description'>{project.startDate} To {project.endDate}</div>
          </div>
        </div>
      );
    });
    if (this.props.jwt){
      return (
        <div className='Projects'>
          <div class='ui hidden divider'></div>  
          <h2 class='ui center aligned icon header'>
            <i class='circular suitcase icon'></i>
            Projects
          </h2>
          <div className='ui center aligned'>  
            <Link to='/projects/add'><div class='ui button' >Add Project</div></Link>
          </div>
          <div class='ui clearing divider'></div>  
          <Confirm header='Delete Project?' open={this.state.showDeleteConfirmation} onCancel={this.closeDeleteModal} onConfirm={this.deleteProject} />
          <div class='ui middle aligned divided list vertical-scrolling-content'>
            {projects}
          </div>
        </div>
      );
    }else {
      return <Redirect to='/'/>;
    }
  }  
}

export default Projects;
