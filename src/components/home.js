import React from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import config from 'react-global-configuration';


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'projects': null,
      'tasks': null,
      'users': null
    };
    this.fetchStatistics = this.fetchStatistics.bind(this);
    this.fetchStatistics();
  }

  fetchStatistics() {
    if (this.props.jwt){
      var component = this;
      $.ajax({
        url: config.get('backend')+'/api/statistics/',
        method: 'GET',
        data: {},
        headers: {
          Authorization: 'JWT '+ this.props.jwt
        },
        beforeSend: function () {
           $('.page-segment').addClass('loading');
        }
      }).done(function (data) {
        component.setState({projects: data.projects});
        component.setState({tasks: data.tasks});
        component.setState({users: data.users});
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
  
  render() {
    if (this.props.jwt){
      return (
        <div className='home'>
          <div className='ui center aligned '>
            <img src='./logo.png' alt='site logo'></img>
          </div>
          
          <div className='ui clearing divider'></div>
          <div class='ui middle aligned divided list'>
            <div class='item'>
              <i class='large middle aligned suitcase icon'></i>
              <div class='content'>
                <div class='header'><Link to='/projects'>Projects</Link></div>
                <div class='description'>{this.state.projects} projects available</div>
              </div>
            </div>
            <div class='item'>
              <i class='large middle aligned tasks icon'></i>
              <div class='content'>
                <div class='header'><Link to='/tasks'>Tasks</Link></div>
                <div class='description'>{this.state.tasks} tasks available</div>
              </div>
            </div>
          </div>
        </div>
      );
    }else{
      return (
        <div className='ui center aligned home'>
          <div>
            <img src='./logo.png' alt='site logo'></img>
          </div>
          <div className='ui header'>
            we organise alomost everything
          </div>
          <div className='ui hidden divider'></div>
          <Link to='/signup'><div className='ui button'>Sign Up</div></Link>
          <Link to='/login'><div className='ui button'>Sign In</div></Link>
        </div>
      )
    }
  }  
}

export default Home;
