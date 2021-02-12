import React from 'react';
import PhotoHeader from '../components/PhotoHeader';
import {Button} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import ny from '../images/ny.png';

const LandingPage = () => {
    const history = useHistory();
    return(
        <>
            <PhotoHeader />
            <h2>Browse and report paranormal activity near you</h2>
            <h5>View paranormal encounter reports from different users</h5>
            <img src={ny} alt="new york"></img>
            <h5>Share your paranormal experiences with others</h5>
            <Button onClick={()=> history.push('/map')}>Get Started</Button>
        </>
    )

}

export default LandingPage;