import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import {  createTeamWager } from '../../actions/wager';
import { loadUser } from '../../actions/auth';

import Spinner from '../layout/Spinner';
import axios from 'axios';
import { connect } from 'react-redux';

import { useSetAmountNfee } from '../../custom-hooks/useSetAmountNfee';
import useDropdown from '../../custom-hooks/useDropdown';
import useDropDownBestOf from '../../custom-hooks/useDropDownBestOf';




const teamSizeList = ['1v1', '2v2', '3v3', '4v4', '5v5'];

const games = {
  fortnite:['Kill Races'],
  CallOfDutyWarzone: ["Kill Races"],
  ApexLegends: ["Kill Races", "Most Damage"],
  PUBG:["Kill Races", "Most Damage"],
  SMITE:["Duel", "Joust", "Conquest"],
  WorldOfWarcraft:["Arena"]
  };

const bestOfAmount = [ '1','3'];

const Wager = ({  auth: { user, isAuthenticated }, createTeamWager}) => {

  const [amount, fee, finalPrice, setAmount] = useSetAmountNfee(0.0);
  const [teamSize, SelectTeamSize] = useDropdown('TeamSize', '0', teamSizeList);
  const [bestOf, SetBestOf] = useDropDownBestOf('BestOf:','', bestOfAmount);
 
  const [selectedGame, setSelectedGame] = useState("");
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState("");

  const [userSearch, setUserSearch] = useState({ username: '' });
  const [homeTeam, setHomeTeam] = useState([]);
  const [awayTeam, setAwayTeam] = useState([]);

  const [createTheWager, setCreateTheWager] = useState({ description: '' });
  
  const { username } = userSearch;
  const { description } = createTheWager;

  
  const gameList =  Object.keys(games).map(key => ({
    name: key
  }));

  function handleGameSelect(e) {
    console.log("Selected Game", e.target.value);
    const gameSel = e.target.value;
    const modeSel = gameSel !== "" ? games[gameSel] : "";
    setSelectedGame(gameSel);
    setModes(modeSel);
    setSelectedMode("");
  }
  
  function handleModeSelect(e) {
    console.log("Selected Mode", e.target.value);
    const modeSelect = e.target.value;
    setSelectedMode(modeSelect);
  }

  const onChangeUser = (e) =>
    setUserSearch({ ...userSearch, [e.target.name]: e.target.value });

  const onChange = (e) =>
    setCreateTheWager({ ...createTheWager, [e.target.name]: e.target.value });


  const onChangeAmount = (e) => {
    const regex = /^\d*(\.\d{0,2})?$/;
    if (e.target.value.match(regex)) {
      setAmount(e.target.value);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const theUser = user.username;
    for (let i = 0; i < homeTeam.length; i++) {
      for (let j = 0; j < awayTeam.length; j++) {
        const homeTeamSet = new Set(homeTeam);
        const awayTeamSet = new Set(awayTeam);
        const theTeamSize = parseInt(teamSize[0]);
        console.log(homeTeam.length, awayTeam.length, theTeamSize);
        // if (awayTeam[j] === homeTeam[i]) {
        //   alert('same players on both teams');
        //   return;
        // } else if (homeTeam.length !== homeTeamSet.size) {
        //   alert('same players on home team');
        //   return;
        // } else if (awayTeam.length !== awayTeamSet.size) {
        //   alert('same players on away team');
        //   return;
        // } else if (awayTeam.includes(theUser) || homeTeam.includes(theUser)) {
        //   alert('you cannot be on two different teams');
        //   return;
        // } else if (homeTeam.length !== awayTeam.length - 1) {
        //   alert('teams are uneven');
        //   return;
        // } else if (
        //   theTeamSize !== homeTeam.length - 1 &&
        //   theTeamSize !== awayTeam.length
        // ) {
        
        //   return;
        // }
      }
    }
    const wagerInfo = { homeTeam, awayTeam, createTheWager, amount,selectedGame, bestOf};
    if(window.confirm('you are required too record your game and have gamertags in your profile in case of a situation or a dispute. Are you OK with this?')){
    createTeamWager(wagerInfo);
    const players = [...homeTeam, ...awayTeam, user.username];
    window.scrollTo(0, 0);
    console.log(homeTeam, awayTeam, selectedGame, description, bestOf);
    }else{
    console.log('wager did not process');
  }
  };

  const addToHomeTeam = async (e) => {
    e.preventDefault();
    const newUserSearch = { username };
    if (homeTeam.length > 4) {
      alert('You have reached the max amount of players for team');
      return;
    }
    
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
        setHomeTeam([...homeTeam, searchedUser]);
      } catch (err) {}
    
  };

  const addToAwayTeam = async (e) => {
    e.preventDefault();
    const newUserSearch = { username };
    if (awayTeam.length > 5) {
      alert('You have reached the max amount of players for team');
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
          'api/wager/getUserByUsername/',
          body,
          config
        );
        const searchedUser = res.data;
        console.log(searchedUser, 'searched user');
        setAwayTeam([...awayTeam, searchedUser]);
      } catch (err) {}
    }
  };
  const resetHomeTeam = (e) => {
    e.preventDefault();
    setHomeTeam([]);
  };
  const resetAwayTeam = (e) => {
    e.preventDefault();
    setAwayTeam([]);
  };
  return user === null && !isAuthenticated ? (
    <Spinner />
  ) : (
    <Fragment>
    
      <h1 className='large text-primaryy'>Add Players To Teams</h1>

      <form className='form'>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Username'
            name='username'
            value={username}
            onChange={(e) => onChangeUser(e)}
            required
          />
             <input
            type='button'
            className='btn btn-primary my-1'
            placeholder='Home Team'
            value='Home Team'
            onClick={(e) => addToHomeTeam(e)}
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
            placeholder='Reset Home Team'
            value='Reset HomeTeam'
            onClick={(e) => resetHomeTeam(e)}
          />
          <input
            type='button'
            className='btn btn-primary my-1'
            placeholder='Reset Away Team'
            value='Reset AwayTeam'
            onClick={(e) => resetAwayTeam(e)}
          />
        </div>
      </form>
      <SelectTeamSize />
      <br></br>


    
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <div className='challenge-home bg-light p-2'>
            <h2 className='text-primaryy'>Home Team</h2>
            <div className='home-user'>
              <ul>
                {user.username}
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
                {awayTeam.map((player) => (
                  <li key={player}>
                    {player}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <span>Game:</span>
        <select
          name="Games"
          onChange={e => handleGameSelect(e)}
          value={selectedGame}
        >
          <option value="">Select the Game</option>
          {gameList.map((game, key) => (
            <option key={key} value={game.name}>
              {game.name}
            </option>
          ))}
        </select>
        <br></br>
        <span className = 'selectMode'>Mode:</span>
      
          {selectedGame ? (
        <select
          name="Modes"
          onChange={e => handleModeSelect(e)}
          value={selectedMode}
        >
          <option value="">Select the Mode</option>
          {modes.map((mode, key) => (
            <option key={key} value={mode}>
              {mode}
            </option>
          ))}
        </select>
        ):(
          <span className = 'selectMode'> Please Select a Game First before you pick the Mode.</span>
        )}
        <br></br>
        <SetBestOf />
     
        <div className='form-group'>
          <div className='challenge-description bg-white p-2'>
            <h2 className='text-primaryy'>Extra Description</h2>

            <textarea
              rows='4'
              cols='100'
              placeholder='Description of the Wager'
              name='description'
              value={description}
              onChange={(e) => onChange(e)}
            ></textarea>
          </div>
        </div>
        <div className='form-group'>
          <div className='challenge-price bg-white p-2'>
            <h2 className='text-primaryy'>Wager Price</h2>
            {/* <div>Amount of Free Fee Matches Left: {amountOfZeroFeeMatches}</div> */}
            <h3>for each player:</h3>
            <div>Amount: {amount} </div>
            <div> Fee: {fee} </div>
            <div>Final Price:${finalPrice} </div>
            <hr />
            <input
              type='number'
              step='.01'
              placeholder='0.00'
              min='1.00'
              max='300.00'
              name='amount'
              value={amount}
              onChange={(e) => onChangeAmount(e)}
            />
            <h4>min: $1.00 max: $300.00</h4>
          </div>
        </div>
      
        <input type='submit' className='btn btn-primary my-1' />
        <br></br>
        <div className = 'form-group'>
        <div className='challenge-price bg-white p-2'>
        <h2 className='text-primaryy'>Team Sizes Allowed for Each Game</h2>
        <h3>Apex Legends: 1v1</h3>
        <h3>Call Of Duty Warzone: 1v1, 2v2</h3>
        <h3>PUBG: 1v1, 2v2</h3>
        <h3>Smite: 1v1, 3v3, 5v5</h3>
        <h3>WorldOfWarcraft: 1v1, 2v2, 3v3</h3>
        <h3>Fortnite: 1v1, 2v2</h3>
        </div>
        </div>
      </form>

        
      
     
    </Fragment>
  );
};
Wager.propTypes = {

  auth: PropTypes.object.isRequired,
  createTeamWager: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  wager: state.wager,
});

export default connect(mapStateToProps, {
  loadUser,
  createTeamWager,
})(Wager);
