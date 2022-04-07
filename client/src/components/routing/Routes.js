import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';

import EditProfile from '../profile-forms/EditProfile';

import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';
import AddingFunds from '../bank-forms/AddingFunds';
import WithdrawlFunds from '../bank-forms/WithdrawlFunds';
import Bank from '../bank/Bank';

import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import Wager from '../wager/Wager';
import PreviousWagers from '../previouswagers/PreviousWagers';
import PublicWager from '../wager/PublicWager';
import AllTheWagers from '../allthewagers/AllTheWagers';
import DisputeForm from '../dispute-forms/DisputeForm';
import Chat from '../messaging/Chat';
import AcceptPublicTeamWager from '../allthewagers/AcceptPublicTeamWager';
import CheckEmailPW from '../auth/CheckEmailPW';
import ResetPassword from '../forgotpassword/ResetPassword';
import HowTo from '../layout/HowTo';
import Leaderboard from '../leaderboard/Leaderboard';
import PrivacyPolicy from '../layout/PrivacyPolicy';
import TOS from '../layout/TOS';
const Routes = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/check-email-pw' component={CheckEmailPW} />
        <Route exact path='/reset-password/:id' component={ResetPassword} />
        <Route exact path ='/how-to' component={HowTo}/>
        <Route exact path = '/privacy-policy' component={PrivacyPolicy}/>
        <Route exact path = '/tos' component={TOS}/>
        <PrivateRoute exact path='/profiles' component={Profiles} />
        <PrivateRoute exact path='/profile/:id' component={Profile} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/add-funds' component={AddingFunds} />
        <PrivateRoute exact path='/withdrawl-funds'component={WithdrawlFunds}/>
        <PrivateRoute exact path='/bank' component={Bank} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        <PrivateRoute exact path='/wager' component={Wager} />
        <PrivateRoute exact path='/create-public-wager' component={PublicWager}/>
        <PrivateRoute exact path ='/accept-public-teamWager' component={AcceptPublicTeamWager}/>
        <PrivateRoute exact path='/chat' component={Chat} />
        <PrivateRoute exact path='/public-wager' component={AllTheWagers} />
        <PrivateRoute exact path='/dispute-form' component={DisputeForm} />
        <PrivateRoute exact path='/previous-wagers' component={PreviousWagers} />
        <PrivateRoute exact path='/leaderboard'component={Leaderboard}/>
   
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
