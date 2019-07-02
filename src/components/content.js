import React from 'react';
import Home from './home';
import Projects from './projects';
import Login from './login';
import SignUp from './signup';
import Tasks from './tasks';
import AddUpdateProject from './addUpdateProject';
import AddUpdateTask from './addUpdateTask';
import ViewProject from './viewProject';
import ViewTask from './viewTask';

import { Switch, Route } from 'react-router-dom'

class Content extends React.Component {
	render() {
		return (
			<Switch>
			  <Route exact path='/' render={(props) => <Home {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} /> }/>
			  <Route exact path='/login' render={(props) => <Login {...props} jwt={this.props.jwt} setToken={this.props.setToken} openMessageModal={this.props.openMessageModal} /> } />

			  <Route exact path='/signup' render={(props) => <SignUp {...props} jwt={this.props.jwt} setToken={this.props.setToken} openMessageModal={this.props.openMessageModal} /> } />

			  <Route path='/tasks/:tid/update' render={(props) => <AddUpdateTask {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>
			  <Route path='/tasks/:tid/view' render={(props) => <ViewTask {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>
			  <Route path='/tasks/add' render={(props) => <AddUpdateTask {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>
			  <Route path='/tasks' render={(props) => <Tasks {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>

			  <Route path='/projects/:pid/update' render={(props) => <AddUpdateProject {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>
			  <Route path='/projects/:pid/view' render={(props) => <ViewProject {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>

			  <Route path='/projects/:pid/tasks/:tid/update' render={(props) => <AddUpdateTask {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>
			  <Route path='/projects/:pid/tasks/:tid/view' render={(props) => <ViewTask {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>
			  <Route path='/projects/:pid/tasks/add' render={(props) => <AddUpdateTask {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>

			  <Route path='/projects/add' render={(props) => <AddUpdateProject {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>
			  <Route exact path='/projects' render={(props) => <Projects {...props} jwt={this.props.jwt} signOut={this.props.signOut} openMessageModal={this.props.openMessageModal} />}/>

			</Switch>
		);
	}
}

export default Content;