import React from 'react';
import { Link } from 'react-router-dom';

const DashboardActions = ({ wager: { disputedwagers } }) => {
  return (
    <div className='dash-buttons'>
      <Link to='/wager' className='btn btn-light'>
        <i className='fa fa-handshake text-primaryy' /> Challenge A Friend
      </Link>
      <Link to='/previous-wagers' className='btn btn-light'>
        <i className='fa fa-history text-primaryy' /> Previous Wagers
        {disputedwagers === undefined || disputedwagers.length==0 ? 
          null
          :<i className = 'fas fa-bell' />
          }
      </Link>  
      <Link to='/create-public-wager' className='btn btn-light'>
        <i className='fa fa-users text-primaryy' /> Create A Public Wager
      </Link>
      <Link to='/public-wager' className='btn btn-light'>
        <i className='fa fa-list text-primaryy' /> All Public Wagers
      </Link>
      <Link to='/leaderboard' className='btn btn-light'>
      <i class="fas fa-list-ol text-primaryy"/> Leaderboards
      </Link>
    </div>
  );
};

export default DashboardActions;
