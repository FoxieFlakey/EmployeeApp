'use client';

import { useEffect, useState } from "react";
import { API_URL, WEB_URL } from "./config";

function ApiPing() {
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ response, setResponse ] = useState<string | null>(null);
  
  useEffect(() => {
    fetch(API_URL + "/ping")
      .then((fetchResponse) => {
        if (!fetchResponse.ok) {
          setError(fetchResponse.statusText)
          return Promise.resolve(null)
        } else {
          return fetchResponse.text()
        }
      })
      .then((responseText) => {
        setResponse(responseText)
        setLoading(false)
      })
  }, []);
  
  if (loading) {
    return <p>Loading...</p>
  }
  
  if (response) {
    return <p>Got response: { response }</p>
  }
  
  return <p>An error occured: { error }</p>
}

export default function Home() {
  return (
    <>
      <p>
        Response from backend is
      </p>
      
      <div style={{
        margin: "5px",
        backgroundColor: "#888888"
      }}>
        <ApiPing />
      </div>
      
      <p>
        URL for web is <a href={ WEB_URL }>{ WEB_URL }</a><br></br>
        URL for API is <a href={ API_URL }>{ API_URL }</a>
      </p>
    </>
  );
}
