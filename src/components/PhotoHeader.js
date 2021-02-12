import React from 'react';
import './PhotoHeader.css';
import logo from '../images/logo.png';

const HeaderPhoto = () => {

    // neo tech std regular

    return (
        <div className="image-title-container">
            <a href="/"><img className="logo" alt="phantom find header logo" src={logo}/></a>
            <a href="/" className="title-link">
                <span className="phantom">Phantom</span> 
                <span className="find"> Find</span>
            </a>
        </div>
    )
}

export default HeaderPhoto;