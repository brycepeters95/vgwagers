import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TwitterTimelineEmbed} from 'react-twitter-embed';
const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <section className='landing'>
      <div className='dark-overlay'>

        <div className='landing-inner'>
          <h1 className='x-large'>VG Wagers</h1>
          <p className='lead'>Dedicated Wager system for the Gamers</p>
          <div className='buttons'>
            <Link to='/register' className='btn btn-primary'>
              Sign Up
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
          
       
        <div className ='twitter-feed '>
        <h2 id = 'twitterH2'>Twitter News</h2>
        <TwitterTimelineEmbed
  sourceType="profile"
  screenName="WagersVg"
  options={{height: 400}}
/>
        </div>
       </div>


      <div className = 'landingbottom'>
      <div className = 'landingeasy'> SIMPLE, EASY, FAST </div>
      <div className = 'landingdescription'>
    
      <div className = 'landingline'></div>
      <div className = 'descriptionp1'>
      <div className = 'textp1'>
      Challenge Friends
      </div>
      <i className='fa fa-handshake fa-3x text-primaryy landing-icon' />
      <div className= 'textdescriptionp6'> Create a Private Wager in which you know your opponent or opponenets </div>
      </div>
      <div className = 'landingline'></div>
      <div className = 'descriptionp2'>
      <div className = 'textp1'>
      Public Wager
      </div>
      <i className='fa fa-users fa-3x text-primaryy' />
      <div className= 'textdescriptionp6'> Don't have anyone to wager don't worry post a public wager </div>
      </div>
      <div className = 'landingline'></div>
      <div className = 'descriptionp3'>
      <div className = 'textp1'>
      Profile
      </div>
      <i class="far fa-id-card fa-3x text-primaryy"></i>
      <div className= 'textdescriptionp6'> Customized profile which showcases your wins and losses </div> 
      </div>
      <div className = 'landingline'></div>
      <div className = 'descriptionp4'>
      <div className = 'textp1'>
      Bank
      </div>
      <i class="fas fa-university fa-3x text-primaryy"></i>
      <div className= 'textdescriptionp6'> Keep track of your earnings, transactions, and cash balance </div>
      </div>
      <div className = 'landingline'></div>
      <div className = 'descriptionp5'>
      <div className = 'textp1'>
      Previous Wagers
      </div>
      <i className='fa fa-history fa-3x text-primaryy' />
      <div className= 'textdescriptionp6'> Keep track of your previous matches </div>
      </div>
      <div className = 'landingline'></div>
      <div className = 'descriptionp6'>
        <div className = 'textp1'>
        Disputed Wagers
      </div>
      <i class="fa fa-gavel fa-3x text-primaryy" ></i>
      <div className= 'textdescriptionp6'>
      Situation with your match? Don't worry our team over at VGWagers are well versed in many games in which a problem could occur 
      </div>
      </div>
{/* icons with description */}
      <div className = 'landingline'></div>
      </div>
      <div className = 'landingslogan'>
        Built by Gamers, For Gamers!
      </div>

</div>

      </div>
        
       {/* <div className= 'imagesforlanding'> 

       <div className = 'landingline'>
         See wagers both private and public that you are part of!
       </div>
        <img src = {dashboardiamge} className = 'imagetwo' />
        <div className = 'landingline'></div>
     
        <img src={privatewagerimage} className = 'imageone'  />

       

        <div className = 'landingline'></div>
        <img src = {disputeformimage} className = 'imagethree' />

        <div className = 'landingline'></div>
        <img src = {previousmatchesimage} className = 'imagefour' />

        <div className = 'landingline'></div>
        <img src = {publicwagersimage} className = 'imagefive' />


      </div> */}

  
    </section>
  
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
