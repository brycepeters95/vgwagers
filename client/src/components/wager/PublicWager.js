import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createPublicWager } from '../../actions/wager';

import { connect } from 'react-redux';
import useDropdown from '../../custom-hooks/useDropdown';
import axios from 'axios';
import { useSetAmountNfee } from '../../custom-hooks/useSetAmountNfee';
import useDropDownBestOf from '../../custom-hooks/useDropDownBestOf';


const games = {
  fortnite:['Kill Races'],
  CallOfDutyWarzone: ["Kill Races", "Core Mode"],
  ApexLegends: ["Kill Races", "Most Damage"],
  PUBG:["Kill Races", "Most Damage"],
  SMITE:["Duel", "Joust", "Conquest"],
  WorldOfWarcraft:["Arena"]
  };

const teamSizeList = ['1v1', '2v2', '3v3', '4v4', '5v5'];
const bestOfAmount = [ '1','3'];

const PublicWager = ({ createPublicWager, auth: { user } }) => {
  const [createTheWager, setCreateTheWager] = useState({description: ''});
  const [amount, fee, finalPrice, setAmount] = useSetAmountNfee(0.0);
  const [teamSize, SelectTeamSize] = useDropdown('TeamSize:', '', teamSizeList);
  const [selectedGame, setSelectedGame] = useState("");
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState("");
  const [userSearch, setUserSearch] = useState({ username: '' });
  const [homeTeam, setHomeTeam] = useState([]);
  const [bestOf, SetBestOf] = useDropDownBestOf('BestOf:','', bestOfAmount);

  const { username } = userSearch;
  const {  description} = createTheWager;

 const theTeamSize = parseInt(teamSize[0]);

  const onChangeUser = (e) => setUserSearch({ ...userSearch, [e.target.name]: e.target.value });

  const onChange = (e) => setCreateTheWager({ ...createTheWager, [e.target.name]: e.target.value });

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
      const homeTeamSet = new Set(homeTeam);
      // console.log(homeTeam.length, theTeamSize);
      if (homeTeam.length !== homeTeamSet.size) {
        alert('same players on home team');
        return;
      } else if (homeTeam.includes(theUser)) {
        alert('you cannot be on the same team twice');
        return;
      } else if (theTeamSize - 1 !== homeTeam.length) {
        alert('make sure your team size is accurate');
        return;
      }
    }
    alert(
      '$1.00 service fee for creating the wager, it will be refunded if the wager is not accepted or the wager gets canceled'
    );
    console.log(amount);
    const game = selectedGame
    const wagerInfo = { createTheWager, homeTeam, amount, game, bestOf};
    createPublicWager(wagerInfo);
    window.scrollTo(0, 0);
    console.log(wagerInfo);
  };

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


  const addToHomeTeam = async (e) => {
    e.preventDefault();
    const newUserSearch = { username };
    if (homeTeam.length > 4) {
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
          'api/wager/getUserByUsername',
          body,
          config
        );
        const searchedUser = res.data;
        console.log(searchedUser, 'searched user');
        setHomeTeam([...homeTeam, searchedUser]);
      } catch (err) {}
    }
  };
  const resetHomeTeam = (e) => {
    e.preventDefault();
    setHomeTeam([]);
  };

  return (
    <Fragment>
      <h1 className='customwagertitle'>Create A Public Wager</h1>
      <SelectTeamSize />
      <br></br>
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
  
            {selectedGame ?(
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
              <span className='selectMode'> Please Select a game first</span>
            )}
      <br></br>
      <SetBestOf />
      {theTeamSize !== 1 ? (
        <Fragment>
          <form className='form'>
            <div className='form-group'>
              <input
                type='text'
                placeholder='username'
                name='username'
                value={username}
                onKeyPress={e => {if (e.key === 'Enter') e.preventDefault();}}
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
            placeholder='Reset Home Team'
            value='Reset HomeTeam'
            onClick={(e) => resetHomeTeam(e)}
          />
            </div>
          </form>
          <div className='form-group'>
            <div className='challenge-home bg-light p-2'>
              <h2 className='text-primaryy'>Home Team</h2>
              <div className='home-user'>
                <ul>
                  {user.username}
                  {homeTeam.map((player) => (
                    <li key={player}>
                      {player}
                      {/* <button
                      type='button'
                      onClick={(e) => deleteFromHomeTeams(player)}
                    >
                      Remove
                    </button> */}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Fragment>
      ) : null}
      ;
      <form className='form' onSubmit={(e) => onSubmit(e)}>
  

        <div className='form-group'>
          <div className='challenge-description bg-white p-2'>
            <h2 className='text-primaryy'>Wager Description</h2>

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
            <h3>for each player:</h3>
            <div>Amount: {amount} </div>
            <div> Fee: {fee} </div>
            <div>Final Price:${finalPrice} </div>
            <hr />
            <input
              type='number'
              step='.01'
              placeholder='$0.00'
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
        </div>
        </div>
      </form>
    </Fragment>
  );
};

//on change

// on submit

// fields
PublicWager.propTypes = {
  createWager: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  wager: state.wager,
});

export default connect(mapStateToProps, { createPublicWager })(PublicWager);
