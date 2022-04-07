import React, { Fragment } from 'react';

import PropTypes from 'prop-types';

const BankCashBalance = ({ bank: { balance } }) => {
  return (
    <Fragment>
      <div className='bank-cashBalance'>
        <h2> Cash Balance </h2>
        <div className='balance-value'>${balance}</div>
        <div className='balance-description'>
          Funds Are Used To Place Wagers Against Other Players
        </div>
      </div>
    </Fragment>
  );
};

BankCashBalance.propTypes = {
  balance: PropTypes.object.isRequired,
};

export default BankCashBalance;
