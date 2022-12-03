import React, { useState } from 'react'
import axios from 'axios'
import Dashboard from './Dashboard';
import { useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/login", { username, password });
      props.setUser(res.data);
      props.setAccessToken(res.headers['auth-token-access']);
      props.setRefreshToken(res.headers['auth-token-refresh']);
    } catch (err) {
      console.log(err);
    } finally {
      navigate('/dashboard');
    }
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <br />
          <br/>
          <span> Admin Login </span>
          <br/>
          <br/>
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <br/>
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br/>
          <button type="submit">
            Login
          </button>
        </form>
      )
    </div>
  )
}

export default Login