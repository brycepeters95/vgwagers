import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
import Footer from './components/layout/Footer';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

//if i was using classes this is were i would use componentdidmount 
//but im using useEffect
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    (async function anyNameFunction() {
     store.dispatch(loadUser());
   
   }) 
 
   ();

  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>

            <Route exact path='/' component={Landing} />
            <Route component={Routes} />
           
          </Switch>
          <Footer/>
        </Fragment>
      
       
      </Router>
     
    </Provider>
  );
};

export default App;