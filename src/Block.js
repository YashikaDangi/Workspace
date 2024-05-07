import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Block = () => {
  const [block, setBlock] = useState([]);

  // Fetch block details from the server
  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const response = await axios.get('http://localhost:3000/numbers');
        setBlock(response.data.numbers);
      } catch (error) {
        console.error('Error fetching block details:', error);
      }
    };

    fetchBlock();
  }, []);

  // Render block details
  return (
    <div className="p-2 m-2 overflow-hidden">
      <h2 className="text-white text-2xl font-bold mb-8">Block Details</h2>
      <div className="flex flex-nowrap overflow-x-auto">
        {block.map((block, index) => (
          <div key={index} className="bg-[#482270] p-8 inline-block mr-4 items-center">
            
            <div className='text-[#d5cfcf]'>
              <p className="font-bold ">Value:</p>
              <p className='text-[#1bd8f4]'>{block.value}</p>
              <p className="font-bold mt-2">Timestamp:</p>
              <p className='text-[#1bd8f4]'>{new Date(block.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Block;