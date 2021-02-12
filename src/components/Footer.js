import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-custom container-sm">
            <div>
                <Link className="link-custom" to="/support">Request Support</Link>
            </div>
            <div className="bottom-link">
                <Link className="link-custom" to="/terms">Terms and Conditions</Link>
            </div>
        </footer>
    )
}

export default Footer;