import React from 'react'
import { Link } from 'react-router-dom';

interface NavBarProps {
  isAuthenticated: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated }) => {

  const logout = async () => {
    localStorage.removeItem("token");
    window.location.href = '/';
  }

  return (
    <ul className='flex space-x-8 text-white'>
      {!isAuthenticated && (
        <>
        <Link to="/login"><li className='px-6 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium inline-block text-center'>Login</li></Link>
        <Link to="/register"><li className='px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium inline-block text-center'>Register</li></Link>
        </>
      )}
      {isAuthenticated && (
        <>
          <Link to="/"><li className='bg-emerald-600 text-white rounded-md hover:bg-emerald-700 hover:shadow-lg transition duration-300 font-medium inline-block text-center px-3 py-1 cursor-pointer'>Home</li></Link>
          <Link to="/profile"><li className='bg-emerald-600 text-white rounded-md hover:bg-emerald-700 hover:shadow-lg transition duration-300 font-medium inline-block text-center px-3 py-1 cursor-pointer'>My Profile</li></Link>
          <Link to="/resumeBuilder"><li className='bg-emerald-600 text-white rounded-md hover:bg-emerald-700 hover:shadow-lg transition duration-300 font-medium inline-block text-center px-3 py-1 cursor-pointer'>Resume Builder</li></Link>
          <button onClick={logout} className='bg-red-700 hover:bg-red-800 hover:shadow-lg transition duration-300 px-2 rounded-lg font-medium'>Logout</button>
        </>
      )}
    </ul>
  )
}

export default NavBar