import React, { useEffect, useState } from 'react'
import axios from 'axios'
import jwt_decode from "jwt-decode";



function Report({ id, accessToken, setAccessToken, refreshToken }) {
  const [reportTable, setReportTable] = useState('');
  useEffect(() => {
    const start = async () => {
      try {
        const res = await axiosJWT.get(`http://localhost:5000/report?id=${id}`, {
          headers: {
            'auth-token-access': accessToken
          }
        })
        console.log(res)
        setReportTable(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }
    start();
  }, [id]);

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post("http://localhost:5001/requestNewAccessToken", {}, {
        headers: {
          'auth-token-refresh': refreshToken
        }
      });
      // setAccessToken(res.headers['auth-token-access']);
      return res.headers['auth-token-access']
    } catch (err) {
      console.log(err);
    }
  };

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const newAccessToken = await refreshAccessToken();
        config.headers["auth-token-access"] = newAccessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const asArray = () => {
    if (reportTable.length > 0) {
      return reportTable.map((item) => {
        return (
          <>
            <li>{JSON.stringify(item)}</li>
          </>
        )
      })
    }
  }

  const asHashmap = () => {
    if (reportTable) {
      return Object.keys(reportTable).map((key) => {
        console.log(`${key}: ${JSON.stringify(reportTable[key])}`)
        return (
          <>
            <li>{key}: {JSON.stringify(reportTable[key])}</li>
          </>
        )
      })
    }
  }



  return (
    <>
      <div>Report {id && id}</div>
      <div> 
        <ul>
      {reportTable.constructor === Array ? asArray() : asHashmap()}
      </ul>
      </div>
    </>
  )
}

export default Report