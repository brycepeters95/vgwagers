import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import {
  createProfile,
  getCurrentProfile,
  deleteAccount,
  changeAvatar,
  sumbitTaxInfo,
  getTaxInfo
} from '../../actions/profile';



const EditProfile = ({
  profile: { profile, loading },
  auth: {user},
  tax:{taxMessage},
  createProfile,
  getCurrentProfile,
  history,
  deleteAccount,
  changeAvatar,
  sumbitTaxInfo,
  getTaxInfo
 
}) => {
  const [formDataSelf, setFormDataSelf] = useState({
    bio: '',
    twitter: '',
    youtube: '',
    instagram: '',
    pc: '',
    xbox: '',
    playstation: '',
 
  });
  const [password, setUserPassword] = useState('');
  const [newPassword, setUserNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [displaySocialInputs, toggleSocialInputs] = useState(false);
  const [changePassword, toggleChangePassword] = useState(false);
  const [displayTaxInfo, toggleTaxInfo] = useState(false);


   const[isLoading, setIsLoading] = useState(false)

  const [taxInfo, setTaxInfo] = useState({
    fullName:'',
    SSN:'',
    mailingAddress:''
  })

  const [changeAvatarImage, toggleChangeAvatarImage] = useState(false);
  const [file, setFile]= useState('');
  const [filename, setFilename] = useState('Choose File');
  useEffect(() => {
    (async function anyNameFunction() {
      await getTaxInfo();
      getCurrentProfile();

   })();
  }, []);


  const { bio, twitter, youtube, instagram, pc, xbox, playstation, } = formDataSelf;
   
  const {fullName, SSN, mailingAddress} = taxInfo;


  const onChangeUpload = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmitUpload = async e => {
    e.preventDefault();
    let data = new FormData();
    // console.log(path.extname(file.originalname))
    data.append('upload', file);
  changeAvatar(data)
  }


 
    const onChange = e =>
    setFormDataSelf({
      ...formDataSelf,
      [e.target.name]: e.target.value
    });

    const onChangePassword = (e) =>
    setUserPassword( e.target.value);

    const onChangeNewPassword = (e) =>
    setUserNewPassword( e.target.value);

    const onChangeConfirmPassword = (e) =>
    setConfirmPassword( e.target.value);
    
    const onChangeTaxInfo = e =>
      setTaxInfo({...taxInfo,
        [e.target.name]: e.target.value
      });
    
  const onSumbitTax = e => {
    e.preventDefault();
    // let fullName = taxInfo.fullName;
    // let ssn = taxInfo.SSN;
    // let mailingAddress = taxInfo.mailingAddress;
    sumbitTaxInfo(taxInfo);

    // console.log(formData,'fd1')
  }

  const onSubmit = e => {
    e.preventDefault();

    let formData = {formDataSelf, password,newPassword,confirmPassword };
    console.log(formData);
    createProfile(formData, history, true);
    window.scrollTo(0, 0);
  };



  return !profile && !user ? (
    <Spinner/>
    ):(
      <Fragment>
 <h1 className='large text-primaryy'> Edit Your Profile</h1>

      <p className='lead'>
        <i className='fas fa-user' /> Add some changes to your profile
      </p>
     <p className ='smallone'><small> * = required field </small></p> 

    <div className = 'center'>
      <form className='form' onSubmit={e => onSubmitUpload(e)}>
      <div className='my-2'>
          <button
            onClick={() => toggleChangeAvatarImage(!changeAvatarImage)}
            type='button'
            className='btn btn-lightone'
          >
            Change Avatar
          </button>
      
        </div>
        
        {changeAvatarImage && (
          <Fragment>

      <div className='custom-file mb-4'>Change Avatar
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChangeUpload}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        </Fragment>
        )}
        </form>
        </div>
        


            <form className ='form' onSubmit={e => onSumbitTax(e)}>
        <div className='my-2'>
        <button
            onClick={() => toggleTaxInfo(!displayTaxInfo)}
            type='button'
            className='btn btn-lightone'
          >
            Tax Form
          </button>
          </div>

        {displayTaxInfo && (
          <Fragment>
       
        <div className = 'alert alert-light' >{taxMessage}</div>
        <div className='form-group social-input'>
        <input
            type='text'
            placeholder='Full Name'
            name='fullName'
            value={fullName}
            onChange={e => onChangeTaxInfo(e)}
          />
              </div>

              <div className='form-group social-input'>
          <input
            type='text'
            placeholder='SSN'
            name='SSN'
            value={SSN}
            onChange={e => onChangeTaxInfo(e)}
          />
        </div>

        <div className='form-group social-input'>
         
          <input
            type='text'
            placeholder='MailingAddress'
            name='mailingAddress'
            value={mailingAddress}
            onChange={e => onChangeTaxInfo(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        </Fragment>  
        )}  
        </form> 
     

      <form className='form' onSubmit={e => onSubmit(e)}>
   
        <div className='form-group'>
          <textarea
            placeholder='A short bio of yourself'
            name='bio'
            value={bio}
            onChange={e => onChange(e)}
          />{' '}
          <small className='form-text'> Tell us a little about yourself </small>{' '}
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='PC GT'
            name='pc'
            value={pc}
            onChange={onChange}
          />
          <small className='form-text'>Enter your PC GamerTag</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='XBOX GT'
            name='xbox'
            value={xbox}
            onChange={onChange}
          />
          <small className='form-text'>Enter your Xbox GamerTag</small>
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Playstation GT'
            name='playstation'
            value={playstation}
            onChange={onChange}
          />
          <small className='form-text'>Enter your Playstation GamerTag</small>
        </div>

     

        <div className='my-2'>
          <button
            onClick={() => toggleSocialInputs(!displaySocialInputs)}
            type='button'
            className='btn btn-light'
          >
            Add Social Network Links{' '}
          </button>{' '}
          <span> Optional </span>{' '}
        </div>
        {displaySocialInputs && (
          <Fragment>
            <div className='form-group social-input'>
              <i className='fab fa-twitter fa-2x' />
              <input
                type='text'
                placeholder='Twitter URL'
                name='twitter'
                value={twitter}
                onChange={e => onChange(e)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-youtube fa-2x' />
              <input
                type='text'
                placeholder='YouTube URL'
                name='youtube'
                value={youtube}
                onChange={e => onChange(e)}
              />
            </div>

            <div className='form-group social-input'>
              <i className='fab fa-instagram fa-2x' />
              <input
                type='text'
                placeholder='Instagram URL'
                name='instagram'
                value={instagram}
                onChange={e => onChange(e)}
              />
            </div>
          </Fragment>
        )}


        <div className='my-2'>
          <button
            onClick={() => toggleChangePassword(!changePassword)}
            type='button'
            className='btn btn-light'
          >
            Change Password
          </button>
      
        </div>
        {changePassword && (
          <Fragment>
            <div className='form-group social-input'>
              <input
                type='password'
                placeholder='Current Password'
                name='Current Password'
                value={password}
                onChange={e => onChangePassword(e)}
              />
            </div>

            <div className='form-group social-input'>
          
              <input
                type='password'
                placeholder='New Password'
                name='New Password'
               value={newPassword}
                onChange={e => onChangeNewPassword(e)}
              />
            </div>

            <div className='form-group social-input'>
         
              <input
                type='password'
                placeholder='Confirm New Password'
                name='Confirm'
                value={confirmPassword}
                onChange={e => onChangeConfirmPassword(e)}
              />
            </div>
          </Fragment>
        )}
        <div className = 'centerone'>

        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
        <Fragment>
          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus' /> Delete My Account
            </button>
          </div>
        </Fragment>
        </div>
      </form>
      </Fragment>
    )
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  tax: state.tax
});

export default connect(mapStateToProps, {
  createProfile,
  getCurrentProfile,
  deleteAccount,
  changeAvatar,
  sumbitTaxInfo,
  getTaxInfo

})(withRouter(EditProfile));
