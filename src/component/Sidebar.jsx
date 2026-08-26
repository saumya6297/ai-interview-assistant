// import "./Sidebar.css";
// import { Link, useLocation } from "react-router-dom";

// function Sidebar() {

//     const location = useLocation();

//     return (

//         <div className="sidebar">

//             <h2 className="logo">
//                 🤖 AI Interview
//             </h2>

//             <nav>

//                 <Link
//                     className={location.pathname === "/dashboard" ? "active" : ""}
//                     to="/dashboard"
//                 >
//                     🏠 Dashboard
//                 </Link>

//                 <Link
//                     className={location.pathname === "/interview" ? "active" : ""}
//                     to="/interview"
//                 >
//                     🎤 Start Interview
//                 </Link>

//               

//                 <Link
//                     className={location.pathname === "/my-interviews" ? "active" : ""}
//                     to="/my-interviews"
//                 >
//                     📋 My Interviews
//                 </Link>
//                 <Link
//                     className={
//                         location.pathname === "/archived-interviews"
//                             ? "active"
//                             : ""
//                     }
//                     to="/archived-interviews"
//                 >
//                     📦 Archived Interviews
//                 </Link>
//                 <Link
//                     className={location.pathname === "/profile" ? "active" : ""}
//                     to="/profile"
//                 >
//                     👤 Profile
//                 </Link>

//                 <Link
//                     className={location.pathname === "/settings" ? "active" : ""}
//                     to="/settings"
//                 >
//                     ⚙️ Settings
//                 </Link>

//             </nav>

//         </div>

//     );
// }

// export default Sidebar;
// import { useState } from "react";
// import { NavLink } from "react-router-dom";

// import {
//     FaRobot,
//     FaHome,
//     FaMicrophone,
//     // FaFileAlt,
//     FaHistory,
//     FaArchive,
//     FaUser,
//     FaCog,
//     FaBars
// } from "react-icons/fa";

// import "./Sidebar.css";

// function Sidebar() {

//     const [collapsed, setCollapsed] = useState(false);

//     return (
//         <aside className={collapsed ? "sidebar collapsed" : "sidebar"}>

//             {/* Toggle Button */}

//             <div
//                 className="sidebar-toggle"
//                 onClick={() => setCollapsed(!collapsed)}
//             >
//                 <FaBars />
//             </div>

//             {/* Logo */}

//             <div className="logo">

//                 <FaRobot size={34} />

//                 {!collapsed && <h2>AI Interview</h2>}

//             </div>

//             {/* Menu */}

//             <nav>

//                 <NavLink
//                     to="/dashboard"
//                     className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                     <FaHome />
//                     {!collapsed && <span>Dashboard</span>}
//                 </NavLink>

//                 <NavLink
//                     to="/interview"
//                     className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                     <FaMicrophone />
//                     {!collapsed && <span>Start Interview</span>}
//                 </NavLink>

//                 {/* <NavLink
//                     to="/resume-review"
//                     className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                     <FaFileAlt />
//                     {!collapsed && <span>Resume Review</span>}
//                 </NavLink> */}

//                 <NavLink
//                     to="/my-interviews"
//                     className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                     <FaHistory />
//                     {!collapsed && <span>My Interviews</span>}
//                 </NavLink>

//                 <NavLink
//                     to="/archived-interviews"
//                     className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                     <FaArchive />
//                     {!collapsed && <span>Archived Interviews</span>}
//                 </NavLink>

//                 <NavLink
//                     to="/profile"
//                     className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                     <FaUser />
//                     {!collapsed && <span>Profile</span>}
//                 </NavLink>

//                 <NavLink
//                     to="/settings"
//                     className={({ isActive }) => (isActive ? "active" : "")}
//                 >
//                     <FaCog />
//                     {!collapsed && <span>Settings</span>}
//                 </NavLink>

//             </nav>

//         </aside>
//     );
// }

// export default Sidebar;
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