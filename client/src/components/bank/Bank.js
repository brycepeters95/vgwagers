import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import BankCashBalance from './BankCashBalance';
import BankTransactions from './BankTransactions';
import BankEarnings from './BankEarnings';
import { getCurrentBank, getEarnings } from '../../actions/bank';

const Bank = ({ getCurrentBank, bank: { bank, loading}, auth }) => {
  useEffect(() => {
    getCurrentBank();
    getEarnings();
  }, []);

  
  return auth.user === null || auth.user.verify === false ?(
  <div>
    <p>Please verify your email before you add funds!</p>
    <Spinner />
  </div>  
  ):
    (
    <Fragment>
      {bank === null || loading   ? (
        <Spinner />
      ) : (
        <Fragment>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === bank.user._id}
          <div className='bank-grid my-1'>
            <BankCashBalance bank={bank} />
            <div className='dash-buttons'>
              <Link to='/add-funds' className='btn btn-light'>
                <i className='fa fa-university text-primaryy' />
                Add Funds
              </Link>

              <Link to='/withdrawl-funds' className='btn btn-light'>
                <i className='fa fa-credit-card text-primaryy' />
                Withdrawl Funds
              </Link>
            </div>
          </div>
          <BankEarnings auth={auth} />
          <BankTransactions bank={bank} />
        </Fragment>
      )}
    </Fragment>
  
  );
};

Bank.propTypes = {
  getCurrentBank: PropTypes.func.isRequired,
  bank: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  bank: state.bank,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentBank, getEarnings })(Bank);
