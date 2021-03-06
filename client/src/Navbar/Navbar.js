import React, { useState } from "react";

// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";

import { IconContext } from "react-icons";

// ROUTING

import { Link } from "react-router-dom";

// DATA FILE
import { SidebarTeacherData, SidebarStudentData } from "./SlidebarData";

// STYLES
import "./Navbar.css";

function NavbarList({ item }) {
  return (
    <li className={item.cName}>
      <Link to={item.path}>
        {item.icon}
        <span>{item.title}</span>
      </Link>
    </li>
  );
}

export default function Navbar({ role }) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#FFF" }}>
        {/* All the icons now are white */}
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {role === "admin" ? (
              <>
                {SidebarTeacherData.map((item, index) => {
                  return <NavbarList key={index} item={item} index={index} />;
                })}
              </>
            ) : (
              <>
                {SidebarStudentData.map((item, index) => {
                  return <NavbarList key={index} item={item} index={index} />;
                })}
              </>
            )}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
