import React, { useState, useEffect } from 'react';
import { ApiClient } from './clients/ApiClient';


import './App.css';

function App() {
  const [testString, setTestString] = useState("");
  const apiClient = new ApiClient();

  useEffect(() => {
    const testEndpoint = async() => {
      var response = await apiClient.get();
      setTestString(response.data.message);
    }

    testEndpoint();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          BudgETS
        </p>
        <p>{testString}</p>
      </header>
    </div>
  );
}

export default App;
