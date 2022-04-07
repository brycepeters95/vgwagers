import React,{useState,useEffect,Fragment} from 'react';
import { connect } from 'react-redux';
import {emailValidateById, changePassword} from '../../actions/auth';
import Spinner from '../layout/Spinner';

const ForgetPassword = ({changePassword,emailValidateById, auth:{emailForReset}, match}) => {
    // const[email, setEmail] = useState(emailForReset);

    const[password, setPassword]=useState('');
    const[password2, setPassword2]=useState('');
    useEffect(() => {
        emailValidateById(match.params.id);
     
      }, [emailValidateById, match.params.id]);

 const onChangePassword = e => setPassword(e.target.value);
 const onChange = e => setPassword2(e.target.value);

 const onSubmit = e =>{
     e.preventDefault();
     const url = match.params.id;
     const email = emailForReset;
     const body = {email, password,url};
    changePassword(body);
 }


    return (
  
        <Fragment>
        <h1>Change Password for {emailForReset}</h1>
        <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChangePassword(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
    
        <input type='submit' className='btn btn-primary' value='Change Password' />
    </form>
    </Fragment>
    );  
};
const mapStateToProps =(state)=>({
    auth: state.auth
});

export default connect(mapStateToProps,{
    emailValidateById, changePassword
}) (ForgetPassword);
