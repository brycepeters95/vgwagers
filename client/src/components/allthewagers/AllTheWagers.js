import React, { useEffect, Fragment, useState } from 'react';
import { getAllTheWagers } from '../../actions/wager';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import Spinner from '../layout/Spinner';
import moment from 'moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  acceptPublic } from '../../actions/wager';
import{loadUser} from '../../actions/auth';

import { useHistory } from "react-router-dom";

//wager id to backend

//get all public wagers
const AllTheWagers = ({
  getAllTheWagers,
  acceptPublic,

  auth: { user },
  wager: { wagers },
  loadUser,
}) => {


  // need to call load user twice or user.username in object allthewagers will be null
  useEffect(() => {
     (async function anyNameFunction() {
     await loadUser();
    getAllTheWagers();
     })();
  }, []);

    let history = useHistory();
  





  const onClickAccept = (wg) => {
console.log(wg.homeTeam.length);   
 if(wg.homeTeam.length > 1){
      localStorage.setItem('wagerHomeTeam', wg.homeTeam);
      localStorage.setItem('wager.id', wg._id);
      localStorage.setItem('wager-amount', wg.amount);
      localStorage.setItem('wager-fee', wg.wagerFee);
      localStorage.setItem('userAccepting', user.username);
    history.push("/accept-public-teamWager");
    return;
    }
    const awayTeam = [];
    const id = wg._id;
    console.log(id);
    acceptPublic({ id, awayTeam});

  };

  //action to accept public wager
  const allThePublicWagers = wagers.map((wg) => (
    <Tr key={wg._id}>
      <Td className='hide-sm'>{wg.homeTeam.map((player, i) => {
          return <li className='hometeamlist' key={player}>{player}</li>;
        })}</Td>
      <Td className='hide-sm'> {wg.awayTeam.map((player) => {
          return <li className='awayteamlist' key={player}>{player}</li>;
        })}</Td>
      <Td className='hide-sm'>{wg.game}</Td>
      <Td className='hide-sm'>{wg.amount}</Td>
      <Td className='hide-sm'>{wg.description}</Td>
      <Td className='hide-sm'>{moment(wg.date).format('MMMM Do, h:mm a')}</Td>
      

        
    
      {user.username === wg.challenger ? (
        <td className='hide-sm'></td>
      ) : (
        <td className='hide-sm'>
          <input
            type='image'
            src={require('../../img/ok.png')}
            className='greencheck'
            onClick={() => onClickAccept(wg)}
          />
        </td>
      )
      }
    </Tr>
  ));

  return user === null ? (
    <Spinner />
  ) : (

    <Fragment>
      <h2 className='my-2' style={{ color: '#4f8737' }}>
        Wagers
      </h2>
      <div className='table-responsive'>
        <Table className='table table-dark table-bordered'>
          <Thead>
            <Tr>
              <Th className='hide-sm'>Challenger</Th>
              <Th className='hide-sm'>Challengee</Th>
              <Th className='hide-sm'>Game</Th>
              <Th className='hide-sm'>Amount</Th>
              <Th className='hide-sm'>Description</Th>
              <Th className='hide-sm'>Date</Th>
              <Th className='hide-sm'>Accept</Th>
            </Tr>
          </Thead>
          <Tbody>{allThePublicWagers}</Tbody>
        </Table>
      </div>
    </Fragment>
  );
};

AllTheWagers.propTypes = {
  getAllTheWagers: PropTypes.func.isRequired,

  wager: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  wager: state.wager,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getAllTheWagers,
   acceptPublic,
  loadUser,
})(AllTheWagers);
