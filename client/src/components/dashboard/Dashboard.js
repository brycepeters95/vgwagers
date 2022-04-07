import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import {
  accept,
  decline,
  won,
  lost,
  getCurrentWager,
  cancel,
  getDisputedWagers,
  getWagers,
  allowWagerChat,

} from '../../actions/wager';
import { getCurrentProfile } from '../../actions/profile';
import Wagers from './Wagers';
import OnGoingWager from './OnGoingWager';
import { loadUser } from '../../actions/auth';

//samepage leader boards


const Dashboard = ({
  won,
  lost,
  cancel,
  loadUser,
  accept,
  decline,
  getWagers,
  getCurrentWager,
  getDisputedWagers,
  allowWagerChat,
  auth: { user, loading,  isAuthenticated},
  wager,
}) => {


  useEffect(() => {
    (async function anyNameFunction() {
       await loadUser();
      await getDisputedWagers();
    })();
    getCurrentWager();
    getWagers();
   
  }, [getWagers, getCurrentWager, getDisputedWagers]);



  

  return loading && user === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primaryy'>Dashboard</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome {user && user.username}
      </p>
      {wager.currentwager  && user !== null ? (
        <Fragment>
          <DashboardActions wager={wager} />

          <OnGoingWager
            allowWagerChat={allowWagerChat}
            wager={wager}
            won={won}
            lost={lost}
            cancel={cancel}
            user={user}
     
          />
   
          <Wagers
            wager={wager}
            user={user}
            accept={accept}
            decline={decline}
           
          />
        </Fragment>
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  wager: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  wager: state.wager,
});

export default connect(mapStateToProps, {
  won,
  lost,
  cancel,
  accept,
  decline,
  getCurrentProfile,
  // deleteAccount,
  getWagers,
  getCurrentWager,
  allowWagerChat,
  getDisputedWagers,
  loadUser

})(Dashboard);
