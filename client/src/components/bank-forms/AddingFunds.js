import { PayPalButton } from 'react-paypal-button-v2';
import React, { Fragment, useState } from 'react';

import axios from 'axios';
import Spinner from '../layout/Spinner';

//create spinner until its approved

const AddingFunds = () => {
  const [total, setTotal] = useState({
    total: '',
  });
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div>
        <h2 className='my-2' style={{ color: '#4f8737' }}>
          Add Funds
        </h2>
        <form>
          <input
            type='number'
            placeholder='0.00'
            name='total'
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
        </form>
      </div>

      <PayPalButton
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: total,
                },
              },
            ],
            // application_context: {
            //   shipping_preference: "NO_SHIPPING" // default is "GET_FROM_FILE"
            // }
          });
        }}
        onApprove={(data, actions) => {
          console.log(data.orderID,'oid')
          console.log(actions,'actions');
          const oid = data.orderID;
          const id = {oid}
            //return axios.post('/api/bank/addFunds', id);
          

          // maybe switch to axios call up here with data.orderid

           return actions.order.capture().then(function (details) {
             //alert('Transaction completed by ' + details.payer.name.given_name);
             console.log(details);
             const date = details.update_time;
             const id = details.id;
             console.log(id,id)
             const total = details.purchase_units[0].amount.value;
             console.log('date:', date, 'id:', id, 'total:', total);
//              const newTransaction = {
//                date,
//                id,
//              };
            const config = {
              headers: {
                 'Content-Type': 'application/json',
              },
            };

          //   // OPTIONAL: Call your server to save the transaction
              return axios.post('/api/bank/addFunds', id, config);
            });
        }}
      />
    </div>
  );
};

export default AddingFunds;
