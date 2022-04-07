import React,{useState} from 'react'
import { connect } from 'react-redux';
import {emailCheckForPW} from '../../actions/auth';

const CheckEmailPW = ({emailCheckForPW}) => {
    const [email, setEmail] = useState('');
    const[emailSent, setEmailSent] = useState(false);

    const onChange = e => setEmail(e.target.value);

    const onSubmit =  e => {
        e.preventDefault();
        if(email === '' || null || undefined){
            alert('please enter a valid email to reset password');
            return;
        }
        emailCheckForPW(email);
    }
    

    return (
        <div>
    <p>Please type your email to reset your password</p> 
    <form className='form' onSubmit={e => onSubmit(e)}>
  
  <div className='form-group'>
    <input
      type='email'
      placeholder='Email Address'
      name='email'
      value={email}
      onChange={e => onChange(e)}
      required
    />
  </div>
  <input type='submit' className='btn btn-primary my-1' />
  </form>
        </div>
    )
};
const mapStateToProps = (state) => ({

  });
  


export default connect(mapStateToProps, {
    emailCheckForPW
})(CheckEmailPW);
