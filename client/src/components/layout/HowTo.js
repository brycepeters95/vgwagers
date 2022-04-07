import React from 'react'
import dashboardImage from '../../img/landing page desc/Dashboard.PNG'
import privateWagerImage from '../../img/landing page desc/createprivatewager.PNG'
import disputeFormImage from '../../img/landing page desc/disputeform.PNG'
import publicWagersImage from '../../img/landing page desc/publicwagers.PNG'
import previousWagerImage from '../../img/landing page desc/Previous Matches.PNG'
import BankImage from '../../img/landing page desc/Bank.PNG';
import ProfileImage from '../../img/landing page desc/profile.PNG';
const HowTo = () => {
    return (
        <div className = 'container'>
            <h1 style={{textAlign:'center', marginBottom:'30px'}}>How The Site Works</h1>
            <div className ='imagecontainer'>
            <h2 className='howtoheader'>Dashboard</h2>
            <div className='linedescription'></div>
           <img className='howtoimage' src = {dashboardImage}></img>
           <div className='linedescription'></div>
           <div className ='description'>
             On the Dashboard you will see the wagers you apart of in the on Going Wager
             Section, and In The Wagers Sections these are the Wagers in which you are invite to

           </div>
           </div>
           <div className ='imagecontainer'>
           <div className='howtoheader'>Creating a Wager</div>
           <div className='linedescription'></div>
           <img className='howtoimage' src = {privateWagerImage}></img>
           <div className='linedescription'></div>
           <div className ='description'> In creating a Wager, you set the team size, set the players for the teams and then set the wager amount.
           The fees for each wager goes as follows  </div>
           </div>
           <div className ='imagecontainer'>
           <div className='howtoheader'>Disputes</div>
           <div className='linedescription'></div>
           <img className='howtoimage' src = {disputeFormImage}></img>
           <div className='linedescription'></div>
           <div className ='description'>Wagers that are subjected to dispute are handled by our team 
           we advise each player to record their game</div>
           </div>
           <div className ='imagecontainer'>
           <div className='howtoheader'>Wagers being Sent to You</div>
           <div className='linedescription'></div>
           <img className='howtoimage' src = {publicWagersImage}></img>
           <div className='linedescription'></div>
           <div className ='description'>These are public wagers that are being sent to you, these are seen on your dashboard</div>
           </div>
           <div className ='imagecontainer'>
           <div className='howtoheader'>PreviousWagers</div>
           <div className='linedescription'></div>
           <img className='howtoimage' src = {previousWagerImage}></img>
           <div className='linedescription'></div>
            <div className ='description'>In the previous wager section you will see previous matches you were apart of, also the disputed matches you are needed to respond to</div>
           </div>
           <div className ='imagecontainer'>
           <div className='howtoheader'>Bank</div>
           <div className='linedescription'></div>
           <img className='howtoimage' src = {BankImage}></img>
           <div className='linedescription'></div>
            <div className ='description'>In this Section, we keep track of your Cash Balance, Earnings, and Transactions</div>
           </div>
           <div className ='imagecontainer'>
           <div className='howtoheader'>Profile</div>
           <div className='linedescription'></div>
           <img className='howtoimage' src = {ProfileImage}></img>
           <div className='linedescription'></div>
            <div className ='description'>On your Profile you can show off your socials,gamertags, and it also show your wins and losses</div>
           </div>
        </div>
    )
}

export default HowTo
