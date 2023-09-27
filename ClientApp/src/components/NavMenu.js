import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {
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
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse
            className="flex space-x-4 ml-auto"
            isOpen={!this.state.collapsed}
            navbar
          >
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">
                  Home
                </NavLink>
              </NavItem>
            </ul>
            <div className="flex space-x-2">
              <button className="border-2 bg-green-500 py-2 px-4 text-black rounded-sm hover:bg-green-700">
                Login
              </button>
              <button className="border-2 bg-white py-2 px-4 text-black rounded-sm hover:bg-green-700">
                Register
              </button>
            </div>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
