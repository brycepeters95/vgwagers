import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const BankTransactions = ({ bank: { transactions } }) => {
  const allTheTransactions = transactions.map((transaction) => (
    <Tr key={transaction._id}>
      <Td className='hide-sm'>$ {transaction.amount}</Td>
      <Td className='hide-sm'>{transaction.type}</Td>
   
      <Td className='hide-sm'>
        {moment(transaction.date).format('MMMM Do, h:mm a')}
      </Td>
      <Td className = 'hide-sm'>
      {transaction.confirm === true ?(
      <input
            type='image'
            src={require('../../img/ok.png')}
            className='greencheck' />
       
      ):(

   null
      )}</Td>
    </Tr>
  ));

  return (
    <Fragment>
      <h2 className='my-2' style={{ color: '#4f8737' }}>
        Transactions
      </h2>
      <div className='table-responsive'>
        <Table className='table table-dark table-bordered'>
          <Thead>
            <Tr>
              <Th className='hide-sm'>Amount</Th>
              <Th className='hide-sm'>Type</Th>

              <Th className='hide-sm'>Date</Th>
              <Th className = 'hide-sm'>Money Sent</Th>
            </Tr>
          </Thead>
          <Tbody>{allTheTransactions}</Tbody>
        </Table>
      </div>
    </Fragment>
  );
};

BankTransactions.propTypes = {};

export default BankTransactions;
