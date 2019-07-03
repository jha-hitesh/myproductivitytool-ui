import React from 'react';
import './App.css';
import Header from './components/header';
import Content from './components/content';
import Cookies from 'universal-cookie';
import config from 'react-global-configuration';
import { Button, Icon, Modal } from 'semantic-ui-react';

class App extends React.Component {

  constructor(props) {
    super(props);
    var backend = 'http://localhost:8000';
    if (window.location.hostname !== 'localhost'){
      backend = 'https://myproductivitytool.herokuapp.com';
    }
    config.set({
      'backend': backend
    },{
      'freeze': false
    });

    var cookies = new Cookies();
    this.state = {
      'jwt': cookies.get('jwt'),
      'messageModalOpen': false,
      'messageType': 'Success',
      'modalMessage': ''
    };
    this.signOut = this.signOut.bind(this);
    this.setToken = this.setToken.bind(this);
    this.closeMessageModal = this.closeMessageModal.bind(this);
    this.openMessageModal = this.openMessageModal.bind(this);
  }

  signOut(){
    var cookies = new Cookies();
    cookies.remove('jwt');
    this.setState({'jwt': null});
  }

  setToken(jwt){
    var cookies = new Cookies();
    cookies.set('jwt', jwt, { path: '/' });
    this.setState({'jwt': jwt});
  }

  closeMessageModal() {

    this.setState({'messageModalOpen': false, 'modalMessage': ''});
  }

  openMessageModal(messageType, modalMessage) {

    this.setState({'messageModalOpen': true, 'messageType': messageType, 'modalMessage': modalMessage});
  }

  
  render() {
    return (
      <div className='App'>
        <div className='ui minimalistic segment page-segment'>
          <Header jwt={this.state.jwt} signOut={this.signOut}/>
          <Content jwt={this.state.jwt} setToken={this.setToken} signOut={this.signOut} openMessageModal={this.openMessageModal}/>
          <Modal open={this.state.messageModalOpen} onClose={this.closeMessageModal} size='small'>
            <Modal.Header>{this.state.messageType}</Modal.Header>
            <Modal.Content>
              <h3>{this.state.modalMessage}</h3>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.closeMessageModal}>
              <Icon name='checkmark' /> Got it
              </Button>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
