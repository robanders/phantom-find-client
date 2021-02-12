import { useQuery, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Link, NavLink as RRNavLink } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import LOGOUT from '../graphql/logout';
import ME from '../graphql/me';
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink, NavbarText } from 'reactstrap';
import './Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const { data, loading, error } = useQuery(ME, { fetchPolicy: 'network-only' });
    const [logout, { client }] = useMutation(LOGOUT, {
        refetchQueries: [{query: ME}],
        awaitRefetchQueries: true
    });

    if(error) {
        console.log(error);
    }

    let header = null;

    if(loading) {
        header = null;
    } else if (!loading && data && data.me) {
        header = <Navbar className="navbar-custom" dark expand="md">
                    <NavbarBrand href="/">Phantom Find</NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink tag={RRNavLink} exact to="/report">Report Paranormal Activity</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={async () => {
                                        const response = await logout();
                                        console.log(response.data);
                                        setAccessToken('');
                                        await client.resetStore();
                                        }}>Logout</NavLink>
                            </NavItem>
                        </Nav>
                        <NavbarText>welcome, {data.me.username}</NavbarText>
                    </Collapse>
                </Navbar>

    } else {
        header = <Navbar className="navbar-custom" dark expand="md">
                    <NavbarBrand href="/">Phantom Find</NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink tag={RRNavLink} exact to="/report">Report Paranormal Activity</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={RRNavLink} exact to="/signup">Sign Up</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={RRNavLink} exact to="/login">Login</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
    }
    return header;
}

export default Header;