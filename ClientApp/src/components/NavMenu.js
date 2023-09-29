import React, { useContext, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./NavMenu.css";
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { LOGIN, REGISTER } from '../gql/auth';
import { useMutation } from "@apollo/client";
import { AuthContext } from "../App";
import Avatar from "./Avatar";

export const NavMenu = () => {
  const { userId, setUserId } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(true);

  const [login] = useMutation(LOGIN, {
    onCompleted: data => {
      if (data?.login?.success) {
        toast.success(data?.login?.message);
        setUserId(data?.login?.data?.id, data?.login?.token);
      } else {
        toast.error(data?.register?.message);
      }
    },
    onError: error => {
      if (error?.graphQLErrors && error?.graphQLErrors[0]?.message.length) {
        toast.error(error?.graphQLErrors[0]?.message);
      } else {
        toast.error("Unexpected error occurred, refresh this current page");
      }
    }
  });

  const [register] = useMutation(REGISTER, {
    onCompleted: data => {
      if (data?.register?.success) {
        toast.success(data?.register?.message);
        setUserId(data?.register?.data?.id, data?.register?.token);
      } else {
        toast.error(data?.register?.message);
      }
    },
    onError: error => {
      if (error?.graphQLErrors && error?.graphQLErrors[0]?.message.length) {
        toast.error(error?.graphQLErrors[0]?.message);
      } else {
        toast.error("Unexpected error occurred, refresh this current page");
      }
    }
  });

  const loginSubmit = (email, password) => {
    login({variables: {
      email,
      password
    }})
  }

  const registerSubmit = (email, password) => {
    register({variables: {
      email,
      password
    }})
  }

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  }

  return (
    <header>
      <Navbar
        className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
        container
        light
      >
        <NavbarBrand tag={Link} to="/" className="text-green-500">
          FunTranslate
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse
          className="flex space-x-4 ml-auto"
          isOpen={collapsed}
          navbar
        >
          <ul className="navbar-nav flex-grow">
            <NavItem>
              <NavLink tag={Link} className="text-dark" to="/">
                Home
              </NavLink>
            </NavItem>
          </ul>
          <div className="flex space-x-2 py-2">
            {
              !userId ? (
                <>
                  <LoginModal onSubmit={loginSubmit} />
                  <RegisterModal  onSubmit={registerSubmit} />
                </>
              ) : (
                <Avatar src='/user-avatar.png' alt='User profile' />
              )
            }
          </div>
        </Collapse>
      </Navbar>
    </header>
  );
};
