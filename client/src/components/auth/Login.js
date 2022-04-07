import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
// import ReCAPTCHA from "react-google-recaptcha";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // const[verify, setVerify] = useState(false);
  // const recaptchaRef = React.createRef();
  const { email, password } = formData;



  const onChangeForm = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    // const recaptchaValue = recaptchaRef.current.getValue();
    // console.log(recaptchaValue)
    // if(verify === true){
    login(email, password);
    return;
  // }
  // alert('please prove you are a Human'); 
}

// function onChange(value) {
//   console.log("Captcha value:", value);
//   setVerify(true);
// }

// const resetCaptcha = () => {
//   // maybe set it till after is submitted
//   recaptchaRef.reset();
// }

  //redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  };



  return (
    <Fragment>
      <h1 className='large text-primaryy'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Sign Into Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
  
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChangeForm(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChangeForm(e)}
            minLength='6'
          />
        </div>
        {/* <ReCAPTCHA
      ref={recaptchaRef}
      sitekey ="6LdAAyofAAAAAOPy2j5j99tK752Hu-ROyAvpS32W" 
     onChange ={onChange}
      /> */}
    
        <input type='submit' className='btn btn-primary' value='Login' />
     
      </form>
      <p className = 'my-1'>Forgot Password? Click
      <Link to = '/check-email-pw'> Here</Link>
      </p>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up!</Link>
      </p>
    </Fragment>
    // link to forget password page twigger api call to send email with random string 
  );
};
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(
  mapStateToProps,
  { login }
)(Login);