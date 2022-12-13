import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import Login from './Login/Login';

function PublicRoutes() {
    return (
        <Switch>
            <Route path={SLUGS.login} component={Login} render={() => <div>login</div>} />
            <Route path={SLUGS.signup} render={() => <div>signup</div>} />
            <Route path={SLUGS.forgotPassword} render={() => <div>forgotPassword</div>} />
            <Redirect to={SLUGS.login} component={Login} />
            <Route exact path='/' component={Login} />
        </Switch>
    );
}

export default PublicRoutes;
