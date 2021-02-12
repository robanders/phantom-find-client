import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import TermsAndConditions from './pages/TermsAndConditions';
import { setAccessToken } from './accessToken';
import MapPage from './pages/MapPage';
import SignupPage from './pages/SignupPage';
import VerifyEmail from './pages/VerifyEmail';
import LoginPage from './pages/LoginPage';
import { Spinner } from 'reactstrap';
import CreateEncounterPage from './pages/CreateEncounterPage';
import LandingPage from './pages/LandingPage';

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:4000/refresh_token', {
            method: 'POST',
            credentials: 'include'
        }).then(async x => {
            const data = await x.json();
            setAccessToken(data.accessToken);
            setLoading(false);
        });
    }, []);

    if(loading) {
        return <div><Spinner className="spinner" style={{ width: '3rem', height: '3rem' }} /></div>;
    }

    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={LandingPage}/>
                    <Route exact path="/map" component={MapPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/signup" component={SignupPage} />
                    <Route exact path="/report" component={CreateEncounterPage} />
                    <Route exact path="/terms" component={TermsAndConditions} />
                    <Route exact path="/verify" component={VerifyEmail} />
                </Switch>
            </div>
        </BrowserRouter>
    )
}

export default App;