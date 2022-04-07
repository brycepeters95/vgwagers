import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profile';
import { getCurrentProfile } from '../../actions/profile';

const Profiles = ({
  getProfiles,
   getCurrentProfile,
  profile: { profiles, loading },
}) => {
  useEffect(() => {
    getProfiles();
     getCurrentProfile();
  }, []);



  return (
    <Fragment>
      {loading && profiles === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='fa fa-users 2x large text-primaryy'>Members</h1>

          <div className='profiles'>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileItem key={profile._id} profile={profile} />
               
              ))
            ) : (
              <h4>No profiles found...</h4>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles, getCurrentProfile })(Profiles);
