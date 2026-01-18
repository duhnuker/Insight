import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Navbar, NavbarContent, NavbarItem, Button } from "@heroui/react";

interface NavBarProps {
  isAuthenticated: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated }) => {

  const guestLogin = async () => {
    try {
      const body = { email: "123@gmail.com", password: "123" };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        body,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      const parseRes = response.data;

      if (parseRes.jwtToken) {
        localStorage.setItem("token", parseRes.jwtToken);
        window.location.href = '/userHome';
      }
    } catch (err) {
      console.error("Guest login failed:", err);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    window.location.href = '/';
  }

  return (
    <Navbar
      className="bg-black/60 backdrop-blur-md border border-emerald-800/30 w-fit rounded-2xl mx-auto"
      position="static"
      classNames={{
        wrapper: "w-fit px-4"
      }}
    >


      <NavbarContent className="gap-4">
        {!isAuthenticated && (
          <>
            <NavbarItem>
              <Link to="/login">
                <Button
                  color="primary"
                  variant="flat"
                  className="hover:bg-emerald-500/20 text-white font-bold ease-in-out duration-300 rounded-xl"
                  size="md"
                >
                  Login
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/register">
                <Button
                  color="primary"
                  variant="solid"
                  className="hover:bg-emerald-500/20 text-white font-bold ease-in-out duration-300 rounded-xl"
                  size="md"
                >
                  Register
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                onClick={guestLogin}
                color="secondary"
                variant="flat"
                className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold ease-in-out duration-300 rounded-xl border border-purple-500/20"
                size="md"
              >
                Guest Login
              </Button>
            </NavbarItem>
          </>
        )}
        {isAuthenticated && (
          <>
            <NavbarItem>
              <Link to="/userHome">
                <Button
                  variant="light"
                  className="text-emerald-400 font-bold hover:bg-emerald-500/20 hover:text-emerald-300 ease-in-out duration-300 rounded-xl"
                >
                  Home
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/profile">
                <Button
                  variant="light"
                  className="text-emerald-400 font-bold hover:bg-emerald-500/20 hover:text-emerald-300 ease-in-out duration-300 rounded-xl"
                >
                  My Profile
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/resumeBuilder">
                <Button
                  variant="light"
                  className="text-emerald-400 font-bold hover:bg-emerald-500/20 hover:text-emerald-300 ease-in-out duration-300 rounded-xl"
                >
                  Resume Builder
                </Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                onClick={logout}
                variant="light"
                className="text-red-400 font-bold hover:bg-red-500/20 hover:text-red-300 ease-in-out duration-300 rounded-xl"
              >
                Logout
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default NavBar