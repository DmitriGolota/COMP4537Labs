import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './Login'
import Main from './Main'
import Report from './Report';
import Dashboard from './Dashboard';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path="/adminlogin" element={<Login setUsername={setUsername} setPassword={setPassword} user={user} setUser={setUser} setAccessToken={setAccessToken} setRefreshToken={setRefreshToken} />} />
          <Route path='/dashboard' element={<Dashboard accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
          <Route path="/report/1" element={<Report id={1} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
          <Route path="/report/2" element={<Report id={2} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
          <Route path="/report/3" element={<Report id={3} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
          <Route path="/report/4" element={<Report id={4} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
          <Route path='/report/5' element={<Report id={5} accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
