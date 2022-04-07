import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProfileItem = ({
  profile:{
    user:{
      _id,avatar,username
    }
  }
 
}) => {

  return (
    <div className='profile bg-light'>
    {/* { console.log(user, 'p')} */}
      <img src={avatar} alt='' className='round-img' />
      <div>
        <h2>{username}</h2>
        {/* ratings */}

        <Link to={`/profile/${_id}`} className='btn btn-primary'>
          View Profile
        </Link>
      </div>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
