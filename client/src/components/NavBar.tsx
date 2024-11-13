import React from 'react'
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <ul className='flex space-x-8 text-white'>
      <Link to="/"><li className='hover:text-lime-500 cursor-pointer'>Home</li></Link>
      <Link to="/profile"><li className='hover:text-lime-500 cursor-pointer'>My Profile</li></Link>
    </ul>
  )
}

export default NavBar