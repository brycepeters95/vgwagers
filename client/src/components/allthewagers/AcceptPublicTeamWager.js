import React, { useEffect,useState, Fragment } from 'react';
import { acceptPublic } from '../../actions/wager';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import axios from 'axios';
 import { useHistory } from "react-router-dom";

const AcceptPublicTeamWager = ({auth:{user, loading, isAuthenticated},acceptPublic}) => {
   const [homeTeam, setHomeTeam]= useState([localStorage.getItem('wagerHomeTeam')]);
   const [userSearch, setUserSearch] = useState({ username: '' });
   const [awayTeam, setAwayTeam] = useState([]);
   const[wagerAmount, setWagerAmount]= useState(localStorage.getItem('wager-amount'));
   const[wagerFee, setWagerFee]= useState(localStorage.getItem('wager-fee'));

   const updatedWagerAmount = parseFloat(wagerAmount);
   const updatedWagerFee = parseFloat(wagerFee);
 const[userAccepting, setUserAccepting] = useState(localStorage.getItem('userAccepting'))
 
   useEffect(() => {
    return () => {
 localStorage.removeItem("wager");
 localStorage.removeItem("userAccepting")
 localStorage.removeItem("wagerHomeTeam")
 localStorage.removeItem("wager-amount")
 localStorage.removeItem("wager-fee")
 localStorage.removeItem("wager.id")
    }
  },[]);

  const { username } = userSearch;


   const onChangeUser = (e) =>
setUserSearch({ ...userSearch, [e.target.name]: e.target.value });

const addToAwayTeam = async (e) => {
    e.preventDefault();
    const newUserSearch = { username };
    if (awayTeam.length >= homeTeam.length) {
      alert('You have reached the max amount of players for your team');
      return;
    }
    {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const body = JSON.stringify(newUserSearch);
        const res = await axios.post(
          'api/wager/getUserByUsername',
          body,
          config
        );
        const searchedUser = res.data;
        console.log(searchedUser, 'searched user');
        setAwayTeam([...awayTeam, searchedUser]);
        console.log(awayTeam,'at1')
      } catch (err) {}
    }
   };

    let history = useHistory();
  
   const onClickAccept = (e)=> {
    e.preventDefault();
   const id = localStorage.getItem('wager.id');
    console.log(id);
    let wagerInfo = {};
    if(awayTeam !==0){
      wagerInfo = {id, awayTeam};
      }else{
         wagerInfo = {id};
      }
     acceptPublic( wagerInfo);
         setTimeout(() =>{
     history.push('/dashboard');
     },1000);
   };

   const resetAwayTeam = (e) => {
    e.preventDefault();
    setAwayTeam([]);
  };



   return user && loading && userAccepting && isAuthenticated === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primaryy'>Add Players to Away team</h1>

      <form className='form'>
        <div className='form-group'>
          <input
            type='text'
            placeholder='username'
            name='username'
            value={username}
            onChange={(e) => onChangeUser(e)}
            required
          />
          <input
            type='button'
            className='btn btn-primary my-1'
            placeholder='Away Team'
            value='Away Team'
            onClick={(e) => addToAwayTeam(e)}
          />
          <input
            type='button'
            className='btn btn-primary my-1'
            placeholder='Reset awayTeam'
            value='Reset awayTeam'
            onClick={(e) => resetAwayTeam(e)}
          />
        </div>
      </form>
      <form className='form' onClick={(e) => onClickAccept(e)}>
        <div className='form-group'>
          <div className='challenge-home bg-light p-2'>
            <h2 className='text-primaryy'>Home Team</h2>
            <div className='home-user'>
              <ul>
              
                {homeTeam.map((player) => (
                  <li key={player}>
                    {player}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className='form-group'>
          <div className='challenge-oppenent bg-light p-2'>
            <h2 className='text-primaryy'>Away Team</h2>
            <div className='away-user'>
              <ul>
              {userAccepting}
                {awayTeam.map((player) => (
                  <li key={player}>
                    {player}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className='form-group'>
        <div className='challenge-price bg-white p-2'>
            <h2 className='text-primaryy'>Wager Price</h2>
            <h3>for each player:</h3>
            <div>Amount: {updatedWagerAmount} </div>
            <div> Fee: {updatedWagerFee} </div>
            <div>Final Price:${updatedWagerAmount + updatedWagerFee} </div>
                  </div>
                  </div>
  
        <input type='submit' className='btn btn-primary my-1' />
      </form>
        
      
     
    </Fragment>
  );

   
}

const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default connect(mapStateToProps,{
acceptPublic,
})(AcceptPublicTeamWager);




