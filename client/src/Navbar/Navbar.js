import React, { useState, useEffect } from "react";
import { query, collection, getDocs, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";

// ICONS
import * as FaIcons from "react-icons/fa"; //Now i get access to all the icons
import * as AiIcons from "react-icons/ai";

import { IconContext } from "react-icons";

// ROUTING

import { Link } from "react-router-dom";

// DATA FILE
import {
  SidebarTeacherData,
  SidebarAdminData,
  SidebarStudentData,
} from "./SlidebarData";

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

function AppNavbar({ role }) {
  if (role === "teacher") {
    return (
      <>
        {SidebarTeacherData.map((item, index) => {
          return <NavbarList key={index} item={item} index={index} />;
        })}
      </>
    );
  } else if (role === "admin") {
    return (
      <>
        {SidebarAdminData.map((item, index) => {
          return <NavbarList key={index} item={item} index={index} />;
        })}
      </>
    );
  } else {
    return (
      <>
        {SidebarStudentData.map((item, index) => {
          return <NavbarList key={index} item={item} index={index} />;
        })}
      </>
    );
  }
}

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const [role, setRole] = useState("");
  const [user] = useAuthState(auth);

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setRole(data.role);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    fetchUserName();
  }, [user]);

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
            <AppNavbar role={role} />
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
