import React from 'react'

const NavBar = () => {
  return (
        <ul className='flex space-x-8 text-white'>
            <li className='hover:text-lime-500 cursor-pointer'>Home</li>
            <li className='hover:text-lime-500 cursor-pointer'>Your job recommendations</li>
            <li className='hover:text-lime-500 cursor-pointer'>My Profile</li>
        </ul>
  )
}

export default NavBar