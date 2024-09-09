import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AddCurrencyPage = () => {
  const [currencyName, setCurrencyName] = useState('');

  const handleAddCurrency = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5275/api/Currency/AddCurrency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currencyName })
    });

    if (response.ok) {
      alert('Currency added successfully');
    } else {
      alert('Failed to add currency');
    }
  };

  return (
    <div>
      <h1>Add Currency</h1>
      <input
        type="text"
        value={currencyName}
        onChange={(e) => setCurrencyName(e.target.value)}
        placeholder="Currency Name"
      />
      <button onClick={handleAddCurrency}>Add Currency</button>
    </div>
  );
};

export default AddCurrencyPage;
