import React from 'react';
import { Switch, Route } from 'react-router-dom';

// pages 
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SingUp';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route parth="/singup" component={SignUp} />
    </Switch>
  );
}