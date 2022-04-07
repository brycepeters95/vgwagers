import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import moment from 'moment';
import { Link } from 'react-router-dom';

const OnGoingWager = ({
  wager: { currentwager },
  won,
  lost,
  cancel,
  user,
  allowWagerChat,

}) => {
  const onClickWon = (wg) => {
    const id = wg._id;
    // if(id !== null){
    //     for(i = 0; i < wg.homeTeam.length; i++){
    //       if (user.username === wg.homeTeam[i]){
    //         localStorage.setItem('PlayersToReview', wg.homeTeam)
    //       }else{
    //         localStorage.setItem('PlayersToReview', wg.awayTeam)
    //       }
    //     }
    // }
    won({ id });
  };
  const onClickLost = (wg) => {
    const id = wg._id;
    // if(id !== null){
    //   for(i = 0; i < wg.homeTeam.length; i++){
    //     if (user.username === wg.homeTeam[i]){
    //       localStorage.setItem('PlayersToReview', wg.homeTeam)
    //     }else{
    //       localStorage.setItem('PlayersToReview', wg.awayTeam)
    //     }
    //   }
    // };
    lost({ id });
  };
  const onClickCancel = (wg) => {
    const id = wg._id;
    const players = [...wg.homeTeam, ...wg.awayTeam]
  
 
    cancel({ id });
  }; 
  const setWagerChat = (wg) => {
    localStorage.setItem('wagerChatId', wg._id);
    allowWagerChat(wg);
  };

  const wagerOngoing = currentwager.map((wg) => (
    <Tr key={wg._id}>
      <Td className='hide-sm'>
      {wg.homeTeam.map((player, i) => {
          return <li className='hometeamlist' key={player}>{player}</li>;
        })}
      </Td>
      <Td className='hide-sm'>
      {wg.awayTeam.map((player) => {
          return <li className='awayteamlist' key={player}>{player}</li>;
        })}
      </Td>
      <Td className='hide-sm'>{wg.game}</Td>
      <Td className ='hide-sm'>{wg.bestOf}</Td>
      <Td className='hide-sm'>{wg.amount}</Td>
      <Td className='hide-sm'>{wg.description}</Td>
      <Td className='hide-sm'>{moment(wg.date).format('MMMM Do, h:mm a')}</Td>
      <Td className='hide-sm'>
      {wg.chat.map((player, i) => {
     return player.username === user.username && player.canChat === true ? (
    <Fragment>
                <Link to='/chat'>
                  <input
                    type='button'
                    value='chat'
                    className='chat'
                    onClick={() => setWagerChat(wg)}
                  />
                </Link>  
                </Fragment>
            ):(
             null
            )
          })}
       </Td>
       <Td className='hide-sm'>
      {wg.status === true ? (
          
        <Fragment>
       
          <input
            type='button'
            value='I WON'
            className='wonbtn decision'
            onClick={() => onClickWon(wg)}
          />
          <input
            type='button'
            value='I LOST'
            className='lostbtn decision'
            onClick={() => onClickLost(wg)}
          />
        
        </Fragment>
      ) : (
        <span>Waiting for all users to accept</span>
      )}
      </Td>
      <Td className='hide-sm'>
      {wg.status === false  && user.username === wg.userCreating ? (
      
          <input
            type='button'
            value='Cancel Wager'
            className='cancelwager'
             onClick={() => onClickCancel(wg)}
          />
      
      ) : (
     <span>cannot cancel</span>
      )}
        </Td>
    </Tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2b' style={{ color: '#4f8737' }}>
        On Going Wager
      </h2>
      <div className='table-responsive'>
        <Table className='table table-dark table-bordered'>
  
          <Thead>
            <Tr>
              <Th className='hide-sm'>Challenger</Th>
              <Th className='hide-sm'>Challengee</Th>
              <Th className='hide-sm'>Game</Th>
              <Th className ='hide-sm'>Best Of</Th>
              <Th className='hide-sm'>Amount</Th>
              <Th className='hide-sm'>Description</Th>
              <Th className='hide-sm'>Date</Th>
              <Th className='hide-sm'>Chat</Th>
              <Th className='hide-sm'>Decision</Th>
              <Th className='hide-sm'>Cancel</Th>
            </Tr>
          </Thead>
          <Tbody>{wagerOngoing}</Tbody>
        </Table>
        </div> 
    </Fragment>
  );
};

OnGoingWager.propTypes = {};

export default OnGoingWager;
