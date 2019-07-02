import React from 'react';
import $ from 'jquery';
import { Redirect, Link } from 'react-router-dom';
import { Confirm } from 'semantic-ui-react';

import config from 'react-global-configuration';


class ViewTask extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'task': {},
      'comments': [],
      'showDeleteConfirmation': false,
      'currentTask': null,
      'currentComment': null,
      'updateComment': false,
    };
    this.fetchTask = this.fetchTask.bind(this); 
    this.saveComment = this.saveComment.bind(this); 
    this.deleteTaskAndComment = this.deleteTaskAndComment.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.cancelCommentUpdate = this.cancelCommentUpdate.bind(this);
  }

  fetchTask() {
    var component = this;
    var url = config.get('backend')+'/api/tasks/'+component.props.match.params.tid+'/view/'
        
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
      component.setState({'task': data.result});
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


  deleteTaskAndComment(event) {
    var component = this;
    var deleteType = null;
    var url = undefined;
    if (this.state.currentTask){
      deleteType = 'task';
      url = config.get('backend')+'/api/tasks/'+this.state.task.id+'/delete/';
    }else if (this.state.currentComment){
      deleteType = 'comment';
      url = config.get('backend')+'/api/tasks/'+this.state.task.id+'/comments/'+this.state.currentComment+'/delete/';
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
      if (deleteType === 'task'){
        component.props.history.push('/tasks');
      }else{
        component.fetchTaskComments();
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

  fetchTaskComments() {
    var component = this;
    var url = config.get('backend')+'/api/tasks/'+component.props.match.params.tid+'/comments/view_active_multiple/';
        
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
      component.setState({'comments': data.results});
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

  saveComment() {
    var component = this;
    var url = '/api/comments/add/';
    if (component.state.currentComment && component.state.updateComment){
      url = '/api/comments/'+component.state.currentComment+'/update/'
    }
    url = config.get('backend')+url;
    var commentText = $("textarea[name=commentText]").val();

    if (commentText === ""){
      component.props.openMessageModal('SUCCESS',"No text to add to comment");
      return;
    }
    var formData = new FormData();
    formData.append('text', commentText);
    formData.append('task', component.state.task.id);

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
      $("textarea[name=commentText]").val("");
      component.setState({'currentComment': null, 'updateComment': false});
      component.props.openMessageModal('SUCCESS',data.message);
      component.fetchTaskComments();
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

  getCommentUpdateForm(currentComment, commentText) {
    this.setState({'currentComment': currentComment, 'updateComment': true});
    $("textarea[name=commentText]").val(commentText);
  }

  cancelCommentUpdate() {
    this.setState({'updateComment': false, 'currentComment': null});
    $("textarea[name=commentText]").val("");
  }

  closeDeleteModal(event) {
    this.setState({'showDeleteConfirmation': false, 'currentComment': null, 'currentTask': null});
  }

  componentWillMount() {
    this.fetchTask();
    this.fetchTaskComments();
  }

  render() {
    if (this.props.jwt){
      var updateLink = '/tasks/'+this.state.task.id+'/update';
      var comments = this.state.comments.map((comment, id) => {
        return (
          <div class='item'>
            <div class='right floated content'>
              <div class='ui small button' onClick={() => this.getCommentUpdateForm(comment.id, comment.text)}>Update</div>
              <div class='ui small button' onClick={() => this.setState({'showDeleteConfirmation': true, 'currentComment': comment.id})}>Delete</div>
            </div>
            <i class='large middle aligned comment outline icon'></i>
            <div class='content'>
              <div class='header'>{comment.createdOn}</div>
              <div class='description'>{comment.text}</div>
            </div>
          </div>
        );
      });
      return (
        <div className='Task'>
          <div class='ui hidden divider'></div>  
          <h2 class='ui center aligned icon header'>
            <i class='circular tasks icon'></i>
            <div className='ui hidden divider'></div>
            {this.state.task.name}
          </h2>
          <div class='ui clearing divider'></div>
          <div className='ui center aligned'>  
            <Link to={updateLink}><div class='ui button'>Update</div></Link>
            <div class='ui button' onClick={() => this.setState({'showDeleteConfirmation': true, 'currentTask': this.state.task.id})}>Delete</div>
          </div>
          <div class='ui clearing divider'></div>  
          <Confirm header='Delete?' open={this.state.showDeleteConfirmation} onCancel={this.closeDeleteModal} onConfirm={this.deleteTaskAndComment} />
          <div className='ui stackable grid'>
            <div className='eight wide column'>
              <div className='ui message'>
              <h4 className='ui header'>Task Description</h4>
              <div class='ui hidden divider'></div>  
              {this.state.task.description}
              <div className='ui hidden divider'></div>
              <h5 className='ui header'>Task Created On: {this.state.task.createdOn}</h5>
              <h5 className='ui header'>Task Last Modified: On {this.state.task.lastModifiedOn}</h5>
              </div>
            </div>
            <div className='eight wide column'>
              <h4 className='ui header'>Task Comments</h4>
              <div className='ui middle aligned divided list vertical-scrolling-content'>
                {comments}
              </div>
              <div className="ui hidden divider"></div>
              <form className="ui form">
                <div className="field">
                  <textarea rows="2" name="commentText"></textarea>
                </div>
                <div className="ui positive button" onClick={this.saveComment}>{this.state.updateComment && 'Update'}{!this.state.updateComment && 'Add'}</div>
                {this.state.updateComment && <div className="ui negative button" onClick={this.cancelCommentUpdate}>Cancel</div>}
                <div className="ui negative button">Clear</div>
              </form>
            </div>
          </div>
        </div>
      );
    }else {
      return <Redirect to='/'/>;
    }
  }  
}

export default ViewTask;
