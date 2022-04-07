import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//have to except component prop, rest gives all the other parameters passedin,
//auth is needed to give access to certain routes
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
  // if not authenicated not loading then redirect back to login page else load w/e 
  //component is passed in and any props that are passed in
}) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loading ? (
       
        <Redirect to='/login' />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);