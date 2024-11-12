import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';



const UserHome = () => {

  const [name, setName] = useState("");
  
  const getProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/userhome", {
        headers: { jwt_token: localStorage.token }
      });

      console.log("Response data:", response.data);
      setName(response.data.name);

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
      console.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className='min-h-screen bg-gray-600 flex-col justify-center pb-4'>
      <div className='p-8 rounded-lg shadow-lg text-center mb-4'>
        <h1 className='text-3xl font-bold text-white mb-8'>Insight</h1>
        <h2 className="text-xl mb-4 text-white">Welcome {name}!</h2>
        <div className='text-center py-6 text-white font-medium italic'>
          Giving you the insight into your next career
        </div>
      </div>
      <div className='flex justify-center pb-4'>
        <NavBar />
      </div>
    </div>
  );
};

export default UserHome;
