import React from 'react';
import $ from 'jquery';
import { Redirect } from 'react-router-dom';
import config from 'react-global-configuration';


class SignUp extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.signUpForService = this.signUpForService.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]:event.target.value});
  }

  componentWillMount() {
  }
  
  signUpForService() {
    var component = this;
    if (!this.state.firstName || !this.state.lastName){
      component.props.openMessageModal('ERROR', 'Please provide your first name and last name');
      return;
    }
    if (!this.state.email){
      component.props.openMessageModal('ERROR', 'Please provide your email address');
      return;
    }
    if (!this.state.username || !this.state.password){
      component.props.openMessageModal('ERROR','Please provide both username and password');
      return;
    }

    if (!this.state.confirmPassword ||this.state.confirmPassword !== this.state.password){
      component.props.openMessageModal('ERROR', 'The confirm password does not match with the password typed above');
      return;
    }

    var formData = new FormData();
    formData.append('firstName', this.state.firstName);
    formData.append('lastName', this.state.lastName);
    formData.append('email', this.state.email);
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);

    $.ajax({
      url: config.get('backend')+'/api/common/signup/',
      method: 'POST',
      data: formData,
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      beforeSend: function () {
         $('.page-segment').addClass('loading');
      }
    }).done(function (data) {
      component.props.history.push('/login');
      component.props.openMessageModal('SUCCESS', 'You have signed up successfully, Please login with your username and password');
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
            <img src='./logo.png' alt='site logo' width="200px"></img>
          </div>
          <div className="ui two column centered grid">
            <div className="column">
              <form className='ui form'>
                <div className='two fields'>
                  <div className='eight wide field'>
                  <label>First Name</label>
                  <input type='text' name='firstName' placeholder='First Name' onChange={this.handleChange}></input>
                  </div>
                  <div className='eight wide field'>
                  <label>Last Name</label>
                  <input type='text' name='lastName' placeholder='Last Name' onChange={this.handleChange}></input>
                  </div>
                </div>
                <div className='two fields'>
                  <div className='eight wide field'>
                    <label>Email</label>
                    <input type='text' name='email' placeholder='Email' onChange={this.handleChange}></input>
                  </div>
                  <div className='eight wide field'>
                    <label>Username</label>
                    <input type='text' name='username' placeholder='Username' onChange={this.handleChange}></input>
                  </div>
                </div>
                <div className='two fields'>
                  <div className='eight wide field'>
                    <label>Password</label>
                    <input type='password' name='password' placeholder='Password' onChange={this.handleChange}></input>
                  </div>
                  <div className='eight wide field'>
                    <label>Confirm Password</label>
                    <input type='password' name='confirmPassword' placeholder='Confirm Password' onChange={this.handleChange}></input>
                  </div>
                </div>
                <button className='ui button' type='button' onClick={this.signUpForService}>Sign Up</button>
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

export default SignUp;
