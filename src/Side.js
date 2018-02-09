import React from 'react'

import { NavLink } from 'react-router-dom'

import logo from './logo.svg';

import './Side.css'

const Sidebar = () => {
  return (
    <div>
      <NavLink style={{ textDecoration: 'none' }} to={`/HomePage`}>
        <img src={logo} alt="Logo" />
      </NavLink>

      <NavLink style={{ textDecoration: 'none' }} to={`/HomePage/cs307`}>
        <p className="classOne" >CS 307</p>
      </NavLink>

      <NavLink style={{ textDecoration: 'none' }} to={`/HomePage/cs252`}>
        <p className="classOne" >CS 252</p>
      </NavLink>

      <NavLink style={{ textDecoration: 'none' }} to={`/settings`}>
        <i className="fas fa-cogs fa-2x settingsLogo" />
      </NavLink>

    </div>
  )
};

export default Sidebar
