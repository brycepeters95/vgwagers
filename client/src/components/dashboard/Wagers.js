import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { connect } from 'react-redux';


const Wagers = ({
  wager: { wagers },
  user,
  accept,
  decline,
 
 
}) => {
  const onClickAccept = (wg) => {
    const id = wg._id;
    console.log(id,'id1');
    accept({ id });

  };
  const onClickDecline = (wg) => {
    const id = wg._id;
    console.log(id);
    decline({ id });
 
  };

 

  const allTheWagers = wagers.map((wg) => (
    <Tr key={wg._id}>
      <Td className='hide-sm'>
        {wg.homeTeam.map((player, i) => {
          return <li key={player}>{player}</li>;
        })}
      </Td>
      <Td className='hide-sm'>
        {wg.awayTeam.map((player) => {
          return <li key={player}>{player}</li>;
        })}
      </Td>
      <Td className='hide-sm'>{wg.game}</Td>
      <Td className='hide-sm'>{wg.bestOf}</Td>
      <Td className='hide-sm'>{wg.amount}</Td>
      <Td className='hide-sm'>{wg.description}</Td>

      <Td className='hide-sm'>{moment(wg.date).format('MMMM Do, h:mm a')}</Td>

      <Td className = 'hide-sm'>
      {wg.statuses.map((status, i) => {
       return status.user === user.username && status.accepted === false ? (
         <Fragment>
             
                  <input
                    type='image'
                    src={require('../../img/ok.png')}
                    className='greencheck accepting'
                    onClick={() => onClickAccept(wg)}
                  />
          
                      <input
                        type='image'
                        src={require('../../img/redx.jpg')}
                        className='redx accepting'
                        onClick={() => onClickDecline(wg)}
                      />
                      
            </Fragment>
            ):(
          null
            )
      })}
      </Td>

  
    </Tr>
  ));

  return (
    <Fragment>
      <h2 className='my-2a' style={{ color: '#4f8737' }}>
        Wagers
      </h2>
      <div className='table-responsive '>
        <Table className='table table-dark table-bordered '>
          <Thead>
            <Tr>
              <Th className='hide-sm'>Challenger</Th>
              <Th className='hide-sm'>Challengee</Th>
              <Th className='hide-sm'>Game</Th>
              <Th className='hide-sm'>Best Of</Th>
              <Th className='hide-sm'>Amount</Th>
              <Th className='hide-sm'>Description</Th>
              <Th className='hide-sm'>Date</Th>
              <Th className='hide-sm'>Accept/Decline</Th>
         
            </Tr>
          </Thead>
          <Tbody>{allTheWagers}</Tbody>
        </Table>
      </div>
    </Fragment>
  );
};

Wagers.propTypes = {
  wagers: PropTypes.array.isRequired,
};

export default Wagers;
