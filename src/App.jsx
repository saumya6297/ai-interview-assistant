import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import MyInterviews from "./pages/MyInterviews";
// import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ArchivedInterviews from "./pages/ArchivedInterviews";
import { UserProvider } from "./context/UserContext";
import ForgotPassword from "./pages/ForgotPassword";
import Verify from "./pages/Verify";
function App() {

  return (

    <UserProvider>

      <BrowserRouter>

        <Routes>

          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/my-interviews" element={<MyInterviews />} />
          {/* <Route path="/resume" element={<Resume />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/archived-interviews"
            element={<ArchivedInterviews />}
          />
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

        </Routes>


      </BrowserRouter>

    </UserProvider>
  );

}

export default App;