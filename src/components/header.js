import React from 'react';
import { withRouter, Link } from 'react-router-dom';


class Header extends React.Component {

  constructor(props) {
    super(props);
    this.signOutWithRedirect = this.signOutWithRedirect.bind(this);
  }

  signOutWithRedirect(){
    this.props.signOut();
    this.props.history.push('/login');
  }
  
  render() {
    if (this.props.jwt){
      return (
        <div className='Header'>
          <div className='ui mini menu'>
            <Link to='/'><div className='item'>Home</div></Link>
            <Link to='/projects'><div className='item'>Projects</div></Link>
            <Link to='/tasks'><div className='item'>Tasks</div></Link>
            <div className='right menu'>

              <div className='ui button' onClick={this.signOutWithRedirect}>Sign Out</div>
            </div>
          </div>      
        </div>
      );
    }else{
      return (
        <div className='header'>
          <div className='ui mini menu'>
             <Link to='/'><div className='item'>Home</div></Link>
            <div className='right menu'>
              <Link to='/signup'><div className='ui button'>Sign Up</div></Link>
              <Link to='/login'><div className='ui button'>Sign In</div></Link>
            </div>
          </div>  
        </div>
      );
    }
  }  
}

export default withRouter(Header);
