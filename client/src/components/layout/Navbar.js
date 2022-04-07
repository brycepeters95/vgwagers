import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  logout } from '../../actions/auth';
import {Modal, Button, Spinner  } from "react-bootstrap";
import moment from 'moment';






// if clicked set state to read if refreshed and notifications has more than previous use different icon
const Navbar = ({ auth: {user, isAuthenticated, loading}, logout}) => {



  const authLinks = (
    <ul>
    
    
      <li>
        <Link to='/'>
         Home
        </Link>
      </li>
      <li>
        <Link to='/profiles'>Members</Link>
      </li>
      <li>
        <Link to='/bank'>
          <i className='fas fa-wallet'></i>
        </Link>
      </li>
      <li>
        <Link to='/edit-profile'>
          <i className='fas fa-user-edit'></i>
        </Link>
      </li>

      <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    
    <ul>
    <li className='hide-sm'>
        <Link to='/how-to'>How To</Link>
      </li>
      <li className='hide-sm'>
        <Link to='/register'>Register</Link>
      </li>
      <li className='hide-sm'>
        <Link to='/login'>Login</Link>
      </li>
    
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='clout' /> VG Wagers
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}

  
    </nav>
    
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
