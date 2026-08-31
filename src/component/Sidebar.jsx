
import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    FaRobot,
    FaHome,
    FaMicrophone,
    FaHistory,
    FaArchive,
    FaUser,
    FaCog,
    FaBars
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>

            {/* Toggle Button */}
            <div
                className="sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
            >
                <FaBars />
            </div>

            {/* Logo */}
            <div className="logo">

                <FaRobot size={34} />

                {!collapsed && <h2>AI Interview</h2>}

            </div>

            {/* Menu */}
            <nav>

                {/* Dashboard */}
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaHome />
                    {!collapsed && <span>Dashboard</span>}
                </NavLink>

                {/* Start Interview */}
                <NavLink
                    to="/interview"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaMicrophone />
                    {!collapsed && <span>Start Interview</span>}
                </NavLink>

                {/* My Interviews */}
                <NavLink
                    to="/my-interviews"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaHistory />
                    {!collapsed && <span>My Interviews</span>}
                </NavLink>

                {/* Archived Interviews */}
                <NavLink
                    to="/archived-interviews"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaArchive />
                    {!collapsed && <span>Archived Interviews</span>}
                </NavLink>

                {/* Profile */}
                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaUser />
                    {!collapsed && <span>Profile</span>}
                </NavLink>

                {/* Settings */}
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        isActive ? "active" : ""
                    }
                >
                    <FaCog />
                    {!collapsed && <span>Settings</span>}
                </NavLink>

            </nav>

        </aside>
    );
}

export default Sidebar;