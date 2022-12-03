import React from 'react'
import Report from './Report';

import {
  Routes,
  Route,
  Link
} from "react-router-dom";

function Dashboard({ accessToken, setAccessToken, refreshToken }) {
  return (
    <div>
      <h1>
        Dashboard
      </h1>
      <nav>
        <ul>
          <li><Link to="/report/1">Report 1 - Unique API users over a period of time</Link></li>
          <li><Link to="/report/2">Report 2 - Top API users over period of time</Link></li>
          <li><Link to="/report/3">Report 3 - Top users for each Endpoint</Link></li>
          <li><Link to="/report/4">Report 4 - 4xx Errors By Endpoint</Link></li>
          <li><Link to="/report/5">Report 5 - Recent 4xx/5xx Errors</Link></li>
        </ul>
      </nav>

    </div>
  )
}

export default Dashboard