import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Hackathons from './pages/Hackathons';
import Jury from './pages/Jury';
import ManageHackathon from './pages/ManageHackathon';
import JuryDashboard from './pages/JuryDashboard';
import StudentHome from './pages/student/StudentHome';
import HackathonDetail from './pages/student/HackathonDetail';
import RegisterForm from './pages/student/RegisterForm';
import PaymentPage from './pages/student/PaymentPage';
import RegistrationDetails from './pages/student/RegistrationDetails';
import CollegeDashboard from './pages/college/CollegeDashboard';
import CollegeForm from './pages/college/CollegeForm';
import CollegeVerifications from './pages/college/CollegeVerifications';
import StudentSignup from './pages/auth/StudentSignup';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

// Wrapper that shows Navbar for student/college pages
const WithNavbar = ({ children }) => (
  <div className="app-container">
    <Navbar />
    <main className="main-content">{children}</main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<StudentSignup />} />

        {/* Admin — no Navbar, uses Sidebar */}
        <Route path="/" element={<PrivateRoute allowedRole="admin"><Dashboard /></PrivateRoute>} />
        <Route path="/hackathons" element={<PrivateRoute allowedRole="admin"><Hackathons /></PrivateRoute>} />
        <Route path="/jury" element={<PrivateRoute allowedRole="admin"><Jury /></PrivateRoute>} />
        <Route path="/manage/:id" element={<PrivateRoute allowedRole="admin"><ManageHackathon /></PrivateRoute>} />

        {/* Student — with Navbar */}
        <Route path="/dashboard" element={<PrivateRoute allowedRole="student"><WithNavbar><StudentHome /></WithNavbar></PrivateRoute>} />
        <Route path="/hackathon/:id" element={<PrivateRoute allowedRole="student"><WithNavbar><HackathonDetail /></WithNavbar></PrivateRoute>} />
        <Route path="/register/:id" element={<PrivateRoute allowedRole="student"><WithNavbar><RegisterForm /></WithNavbar></PrivateRoute>} />
        <Route path="/payment/:id" element={<PrivateRoute allowedRole="student"><WithNavbar><PaymentPage /></WithNavbar></PrivateRoute>} />
        <Route path="/registration/:id" element={<PrivateRoute allowedRole="student"><WithNavbar><RegistrationDetails /></WithNavbar></PrivateRoute>} />

        {/* College — with Navbar */}
        <Route path="/college/form" element={<PrivateRoute allowedRole="college"><WithNavbar><CollegeForm /></WithNavbar></PrivateRoute>} />
        <Route path="/college/dashboard" element={<PrivateRoute allowedRole="college"><WithNavbar><CollegeDashboard /></WithNavbar></PrivateRoute>} />
        <Route path="/college/verifications" element={<PrivateRoute allowedRole="college"><WithNavbar><CollegeVerifications /></WithNavbar></PrivateRoute>} />

        {/* Jury */}
        <Route path="/jury-dashboard" element={<PrivateRoute allowedRole="jury"><JuryDashboard /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;