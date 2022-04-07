import React, { Fragment } from 'react';

import PropTypes from 'prop-types';

const BankEarnings = ({ auth:{user} }) => {
  return (
    <Fragment>
      <h2 className='my-2' style={{ color: '#4f8737' }}>
        Earnings
      </h2>
      <div className='bank-earnings'>
        <div className='balance-value'>${user.earnings}.00 </div>
      </div>
    </Fragment>
  );
};

BankEarnings.propTypes = {};

export default BankEarnings;
