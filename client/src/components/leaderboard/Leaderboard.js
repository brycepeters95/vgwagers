import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Spinner from '../layout/Spinner';
import { 
    getOverallWinsLeaderboard,
    getWLPercentageLeaderboard,
    getOverallEarningsLeaderboard,
    getYearlyEarningsLeaderboard,
    getLeaderboardByGameAndType
} from '../../actions/leaderboard';

import OverallEarningsLeaderboard from './OverallEarningsLeaderboard';
import OverallWinsLeaderboard from './OverallWinsLeaderboard';
import WLPercentageLeaderboard from './WLPercentageLeaderboard';
import YearlyEarningsLeaderboard from './YearlyEarningsLeaderboard';
import ByGameAndEarnings from './ByGameAndEarnings';
import ByGameAndWins from './ByGameAndWins';
import ByGameAndWL from './ByGameAndWL';

const games = {
  AllGames:["All Types"],
  Fortnite:['W/L','Earnings','overallWins'],
  CallOfDutyWarzone: ["W/L", "Earnings", "overallWins"],
  ApexLegends: ["W/L", "Earnings", "overallWins"],
  PUBG:["W/L", "Earnings", "overallWins"],
  SMITE:["W/L", "Earnings", "overallWins"],
  WorldOfWarcraft:["W/L", "Earnings", "overallWins"]
  };


//samepage leader boards


const Leaderboard = ({
    getOverallWinsLeaderboard,
    getWLPercentageLeaderboard,
    getOverallEarningsLeaderboard,
    getYearlyEarningsLeaderboard,
    getLeaderboardByGameAndType,
  auth: { user, loading,  isAuthenticated},
  leaderboard:{overallEarnings, yearlyEarnings, wLPercentage,overallWins,byGameAndType}
}) => {
  const [selectedGame, setSelectedGame]=useState('');
  const [types, setTypes]= useState([]);
  const [selectedType, setSelectedType]=useState('');

  const [loadingLeaderboard, setLoadingLeaderboard]=useState(false)
  const [loadingLeaderboardByGame, setLoadingLeaderboardByGame]=useState(false)

  useEffect(() => {
    if(loadingLeaderboard && selectedGame==='AllGames'){
    
      setLoadingLeaderboardByGame(false);
    getOverallWinsLeaderboard();
    getWLPercentageLeaderboard();
    getOverallEarningsLeaderboard();
    getYearlyEarningsLeaderboard();
    }
    console.log(loadingLeaderboard);
  }, [loadingLeaderboard]);

  const gameList =  Object.keys(games).map(key => ({
    name: key
  }));

  function handleGameSelect(e) {
    console.log("Selected Game", e.target.value);
    const gameSel = e.target.value;
    const typeSel = gameSel !== "" ? games[gameSel] : "";
    setSelectedGame(gameSel);
    setTypes(typeSel);
    setSelectedType("");
  }
  function handleTypeSelect(e) {
    console.log("Selected Mode", e.target.value);
    const typeSelect = e.target.value;
    setSelectedType(typeSelect);
  }
  
  const onSumbitGameAndType = async(e)=>{
    e.preventDefault();
    if(selectedGame === 'AllGames'){
      setLoadingLeaderboard(true);
      return;
    }
    const formData = {game: selectedGame, type:selectedType}
    await getLeaderboardByGameAndType(formData);
    setLoadingLeaderboard(false)
    setLoadingLeaderboardByGame(true);
    };

  
  

  return loading && !user ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primaryy'>Leaderboards</h1>
      <form className='form'  onSubmit={(e) => onSumbitGameAndType(e)}>
      <span>Game:</span>
        <select
          name="Games"
          onChange={e => handleGameSelect(e)}
          value={selectedGame}
        >
          <option value="">Select Game</option>
          {gameList.map((game, key) => (
            <option key={key} value={game.name}>
              {game.name}
            </option>
          ))}
        </select>
        <br></br>
        <span className = 'selectMode'>TYPE:</span>
      
          {selectedGame ? (
        <select
          name="Type"
          onChange={e => handleTypeSelect(e)}
          value={selectedType}
        >
          <option value="">Select the Type</option>
          {types.map((type, key) => (
            <option key={key} value={type}>
              {type}
            </option>
          ))}
        </select>
        ):(
          <span className = 'selectMode'> Please Select a Game First before you pick the Type.</span>
        )}
        <br></br>
        <input type='submit' className='btn btn-primary my-1' />
        </form>
   
          {overallWins.length !== 0 && loadingLeaderboard  ? (
        <Fragment>
          <OverallWinsLeaderboard
            leaderboard ={overallWins}
          />
         </Fragment>
      ) : (
      null
      )}
      {wLPercentage !== 0 && loadingLeaderboard ? (
        <WLPercentageLeaderboard
            leaderboard ={wLPercentage}
          />
      ):(
      null
      )}
         {overallEarnings !== 0 && loadingLeaderboard ? (
          <OverallEarningsLeaderboard
                leaderboard= {overallEarnings}
            />
         ):(
         null
         )}
         {yearlyEarnings !== 0 && loadingLeaderboard ? (
          <YearlyEarningsLeaderboard
                leaderboard={yearlyEarnings}
            />
         ):(
          null
         )}
         {byGameAndType.length !== 0 && selectedType ==='Earnings' && loadingLeaderboardByGame ?(
         <ByGameAndEarnings leaderboard={byGameAndType} />
         ):(
           null
         )}
         {byGameAndType.length !== 0 && selectedType ==='W/L' && loadingLeaderboardByGame ?(
         <ByGameAndWL leaderboard = {byGameAndType} />
         ):(
           null
         )}
         {byGameAndType.length !== 0 && selectedType ==='overallWins' && loadingLeaderboardByGame ?(
        <ByGameAndWins leaderboard ={byGameAndType} />
         ):(
           null
         )}
  
    </Fragment>
  );
};

Leaderboard.propTypes = {

  auth: PropTypes.object.isRequired,

};

const mapStateToProps = (state) => ({
  auth: state.auth,
  leaderboard: state.leaderboard
});

export default connect(mapStateToProps, {
    getOverallWinsLeaderboard,
    getWLPercentageLeaderboard,
    getOverallEarningsLeaderboard,
    getYearlyEarningsLeaderboard,
    getLeaderboardByGameAndType,

})(Leaderboard);