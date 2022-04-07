import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileGamertags = ({ profile: { gamertags } }) => {
  return (
    <div className='profile-gamertags bg-primaryy p-2'>
      <div className='usergamertags my-1'>
        {gamertags && gamertags.pc && (
          <i className='fas fa-desktop fa-2x'>: {gamertags.pc}</i>
        )}

        {gamertags && gamertags.xbox && (
          <i className='fab fa-xbox fa-2x'>: {gamertags.xbox}</i>
        )}
        {gamertags && gamertags.playstation && (
          <i className='fab fa-playstation fa-2x'>: {gamertags.playstation}</i>
        )}
      </div>
    </div>
  );
};

ProfileGamertags.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileGamertags;
