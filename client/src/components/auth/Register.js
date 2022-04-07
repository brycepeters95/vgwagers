import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
// import ReCAPTCHA from "react-google-recaptcha";
//use state like classes form data is the object(state)
//and setformdata is this.setstate passing in the new properties
const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [value, onChange] = useState(new Date());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedAge, setAcceptedAge] = useState(false);
  // const[verify, setVerify] = useState(false);
  // const recaptchaRef = React.createRef();
  

  const { username, name, email, password, password2 } = formData;

  const onChangeForm = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
    // function onChangeCaptcha(value) {
    //   console.log("Captcha value:", value);
    //   setVerify(true);
    // }

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    }else if(acceptedTerms === false){
      setAlert('Please Check approiate fields terms','danger');
    }else if(acceptedAge === false){
      setAlert('Please Check approiate fields age','danger');
    }
    //  else {
      // const captchaValue = recaptchaRef.current.getValue();
  
      // if(verify === true){
      //  register({ username, name, email, password, value, captchaValue });
      register({ username, name, email, password});
      
      // return;
    // }
    // alert('please prove you are a Human');
    }
  //  }


  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primaryy'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Username'
            name='username'
            value={username}
            onChange={e => onChangeForm(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChangeForm(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChangeForm(e)}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChangeForm(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={e => onChangeForm(e)}
          />
        </div>
        <span>Date of Birth(you have to be 18 years or older to Sign Up)</span>
        <div>
      <DatePicker
      onChange={onChange}
        value={value}
      />
    </div>
    <br></br>
       <div>
        <input 
        type="checkbox" 
      checked= {acceptedTerms}
        onChange={(e)=> {setAcceptedTerms(e.target.checked)}} >
        </input>
        Click to Accept <Link to='/tos'>Terms and Conditons</Link> and <Link to ='/privacy-policy'>Privacy Policy</Link>
        </div>
        <div>
        <input
        type="checkbox"
        checked ={acceptedAge}
        onChange={(e)=> {setAcceptedAge(e.target.checked)}}>
         </input>
         Click to Accept that you Are 18 years or older and don't already have a VGWagers Account
         </div>
         {/* <ReCAPTCHA
      ref={recaptchaRef}
      sitekey ="6LdAAyofAAAAAOPy2j5j99tK752Hu-ROyAvpS32W" 
     onChange ={onChangeCaptcha}
      /> */}
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
