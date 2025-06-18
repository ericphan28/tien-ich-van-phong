'use client';

import React, { useState } from 'react';

export default function SimpleTest() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧪 Simple Test Component</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Name:</label>          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <p className="text-sm">Count: {count}</p>          <button 
            onClick={() => setCount(c => c + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Increment ({count})
          </button>
        </div>
        
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Live State:</h3>
          <p>Name: {name || 'Not entered'}</p>
          <p>Count: {count}</p>
        </div>
      </div>
    </div>
  );
}
