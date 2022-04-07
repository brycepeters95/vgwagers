import React, { useState, Fragment } from 'react';
import { setAlert } from '../../actions/alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withdrawlingFunds } from '../../actions/bank';

const WithdrawlFunds = ({ withdrawlingFunds }) => {
  const [withdrawlAmount, setWithdrawlAmount] = useState({
    total: '',
  });
  const { total } = withdrawlAmount;

  const onChange = (e) =>
    setWithdrawlAmount({ ...withdrawlAmount, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    withdrawlingFunds(withdrawlAmount);
    console.log(withdrawlAmount);
  };

  return (
    <form className='form' onSubmit={(e) => onSubmit(e)}>
      <div className='form-group'>
        <h2 className='my-2' style={{ color: '#4f8737' }}>
          Withdrawl Funds
        </h2>
        <input
          type='number'
          placeholder='0.00'
          name='total'
          value={total}
          onChange={(e) => onChange(e)}
          required
        />
      </div>
      <input type='submit' className='btn btn-primary my-1' />
    </form>
  );
};

WithdrawlFunds.propTypes = {
  withdrawlingFunds: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { withdrawlingFunds })(WithdrawlFunds);
