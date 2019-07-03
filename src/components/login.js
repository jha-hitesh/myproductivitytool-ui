import React from 'react';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';
import config from 'react-global-configuration';


class Login extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.fetchToken = this.fetchToken.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]:event.target.value});
  }

  componentWillMount() {
  }
  
  fetchToken() {
    var component = this;
    var setToken = this.props.setToken;
    if (!this.state.username || !this.state.password){
      component.props.openMessageModal('ERROR','Please provide both username and password');
      return;
    }

    var formData = new FormData();
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    $.ajax({
      url: config.get('backend')+'/api/common/get-jwt/',
      method: 'POST',
      data: formData,
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      beforeSend: function () {
         $('.page-segment').addClass('loading');
      }
    }).done(function (data) {
      setToken(data.token);
      component.props.history.push('/');
    }).fail(function (xhr, status, error) {
      var message = 'Request could not be completed';
      if (xhr.responseJSON && xhr.responseJSON.message) {
        message = xhr.responseJSON.message;
      }
      component.props.openMessageModal('ERROR',message);
    }).always(function (xhr, status) {
      $('.page-segment').removeClass('loading');
    });
  }
  render() {
    if (!this.props.jwt){
      return (
        <div>
          <div className='ui center aligned'>
            <img src='./logo.png' alt='site logo' width='300px'></img>
          </div>
          <div className='ui center aligned header'>
            we organise alomost everything
          </div>
          <div className="ui two column centered grid">
            <div className="column">
              <form className='ui form'>
                <div className='field'>
                <label>Username</label>
                <input type='text' name='username' placeholder='Username' onChange={this.handleChange}></input>
                </div>
                <div className='field'>
                <label>Password</label>
                <input type='password' name='password' placeholder='Password' onChange={this.handleChange}></input>
                </div>
                <button className='ui center aligned button' type='button' onClick={this.fetchToken}>Login</button>
              </form>
            </div>
          </div>
        </div>
      ); 
    }else{
      return <Redirect to='/'/>;
    }
  }
}

export default Login;
