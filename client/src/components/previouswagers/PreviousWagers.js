import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  getCompletedWagers,
  getDisputedWagers,
  getDisputedFormWager,
} from '../../actions/wager';
import Spinner from '../layout/Spinner';
import moment from 'moment';
import DisputeWagers from './DisputeWagers';
import CompletedWagers from './CompletedWagers';
import {loadUser} from '../../actions/auth';


const PreviousWagers = ({
  getCompletedWagers,
  getDisputedWagers,
  getDisputedFormWager,
  loadUser,
  wager: { disputedwagers, completedwagers },
  auth: { user },
}) => {
  useEffect(() => {
      (async function anyNameFunction() {
      await loadUser();
      getCompletedWagers();
      getDisputedWagers();
       })()
  }, [getCompletedWagers,getDisputedWagers]);

  const onSetDisputedFormWager = (wg) => {
    const wager = wg;
    localStorage.setItem('disputeFormId', wg._id)
    getDisputedFormWager(wager);
  };





  const disputedWagers = disputedwagers.map((wg) => (
    <Tr key={wg._id}>
      <Td className='hide-sm'> {wg.homeTeam.map((player, i) => {
          return <li key={player}>{player}</li>;
        })}</Td>
      <Td className='hide-sm'>{wg.awayTeam.map((player, i) => {
          return <li key={player}>{player}</li>;
        })}</Td>
      <Td className='hide-sm'>{wg.game}</Td>
      <Td className='hide-sm'>{wg.bestOf}</Td>
      <Td className='hide-sm'>{wg.amount}</Td>
      <Td className='hide-sm'>{wg.description}</Td>
      <Td className='hide-sm'>{moment(wg.date).format('MMMM Do, h:mm a')}</Td>
      {/* this parttttttttttttttt */}
      <Td className ='hide-sm'>
      
      {wg.homeTeamDisputeForms.map(homePlayer =>{
        console.log(homePlayer);
        if(homePlayer.username === user.username && homePlayer.status === true){
          console.log('hit');
       return 'Waiting For Decision'
        }else if(homePlayer.username === user.username && homePlayer.status === false){
          console.log('hit1');
          return(
          <Link to='/dispute-form'>
            <input
              type='button'
              value='form'
              className='chat'
              onClick={() => onSetDisputedFormWager(wg)}
            />
            </Link>
          )
        }else{
          console.log('hit2');
       return (null)
        }
      })}
     

     
      {wg.awayTeamDisputeForms.map(awayPlayer =>{
        console.log(awayPlayer);
        if(awayPlayer.username === user.username && awayPlayer.status === true){
          console.log('hit3');
       return 'Waiting For Decision'
        }else if(awayPlayer.username === user.username && awayPlayer.status === false){
          console.log('hit4');
          return(
          <Link to='/dispute-form'>
            <input
              type='button'
              value='form'
              className='chat'
              onClick={() => onSetDisputedFormWager(wg)}
            />
            </Link>
          )
        }else{
          console.log('hit5');
          return (null)
        }
      })}
        </Td>

    </Tr>
  ));


  const allTheWagers = completedwagers.map((wg) => (
    <Tr key={wg._id}>
      <Td className='hide-sm'>  {wg.homeTeam.map((player, i) => {
          return <li key={player}>{player}</li>;
        })}</Td>
      <Td className='hide-sm'>  {wg.awayTeam.map((player, i) => {
          return <li key={player}>{player}</li>;
        })}</Td>
      <Td className='hide-sm'>{wg.game}</Td>
      <Td className='hide-sm'>{wg.bestOf}</Td>
      <Td className='hide-sm'>${wg.amount}</Td>
      <Td className='hide-sm'>{wg.description}</Td>
      <Td className='hide-sm'>{moment(wg.date).format('MMMM Do, h:mm a')}</Td>
      <Td className = 'hide-sm'> 


        {wg.homeTeam.map((player)=>{
          console.log(wg.result, player, user.username)
          if(player=== user.username && wg.result === 'hometeam'){
            console.log('hit')
              return(
              <input
            type='image'
            src={require('../../img/ok.png')}
            className='greencheck' />
              )
            }else if(player === user.username && wg.result === 'awayteam'){
              console.log('hit1')
              return (
                <input
            type='image'
            src={require('../../img/redx.jpg')}
            className='redx'
          />
              )
            }else{
              console.log('hit2')
          return (null)
        }
      })}
      
      {wg.awayTeam.map((player)=>{
          if(player === user.username && wg.result === 'awayteam'){
            console.log('hit3')
              return(
              <input
            type='image'
            src={require('../../img/ok.png')}
            className='greencheck' />
              )
            }else if(player === user.username && wg.result === 'hometeam'){
              console.log('hit4')
              return (
                <input
            type='image'
            src={require('../../img/redx.jpg')}
            className='redx'
          />
              )
            }else{
              console.log('hit5')
          return (null)
        }
      })}

      

     </Td>
  
        
    </Tr>
  ));

  return user === null && disputedWagers === null && completedwagers === null ? (
    <Spinner />
  ) : (
    <Fragment>
    <DisputeWagers disputedWagers = {disputedWagers} />
     <CompletedWagers allTheWagers ={allTheWagers} />
</Fragment>

  
  );
};


const mapStateToProps = (state) => ({
  wager: state.wager,
  auth: state.auth,
});

// getting actions from (actions/wager import) using connect, map state to props is getting The state and mapping it to a prop
export default connect(mapStateToProps, {
  getCompletedWagers,
  getDisputedWagers,
  getDisputedFormWager,
  loadUser,
})(PreviousWagers);
