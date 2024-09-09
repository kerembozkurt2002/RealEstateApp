import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AccountDashboards/AdminDashboard';
import UserDashboard from './components/AccountDashboards/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './components/Sign/SignUp';
import SignIn from './components/Sign/SignIn';
import Dashboard from './components/GeneralDashboard/Dashboard';
import TemplatePage from './components/TemplatePage';
import TokenPage from './components/TokenPage'; 
import AddCurrencyPage from './components/AdminPages/AddCurrencyPage';
import CurrencyPage from './components/AdminPages/CurrencyPage';
import StatusPage from './components/AdminPages/StatusPage';
import EstateTypePage from './components/AdminPages/EstateTypePage';
import EstateAdd from './components/EstatePages/EstateAdd';
import EstateList from './components/EstatePages/EstateList';
import EstateInfo from './components/EstatePages/EstateInfo';
import EstateInfoPage from './components/EstatePages/EstateInfoPage';
import EstateEdit from './components/EstatePages/EstateEdit';
import EstateMap from './components/EstatePages/EstateMap';
import EstatePhotosPage from './components/PhotoUpload';
import Home from './components/Home';
function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/template" element={<ProtectedRoute><TemplatePage /></ProtectedRoute>} />
                <Route path="/tokenpage" element={<ProtectedRoute><TokenPage /></ProtectedRoute>} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/Home" element={<Home />} />

                
                <Route path="/Photo" element={<EstatePhotosPage />} />

                <Route path="/AddCurrency" element={<ProtectedRoute role="Admin"><AddCurrencyPage /></ProtectedRoute>} />
                <Route path="/CurrencyPage" element={<ProtectedRoute role="Admin"><CurrencyPage /></ProtectedRoute>} />
                <Route path="/StatusPage" element={<ProtectedRoute role="Admin"><StatusPage /></ProtectedRoute>} />
                <Route path="/EstateTypePage" element={<ProtectedRoute role="Admin"><EstateTypePage /></ProtectedRoute>} />

                <Route path="/EstateAdd" element={<ProtectedRoute ><EstateAdd /></ProtectedRoute>} />
                <Route path="/EstateList" element={<ProtectedRoute><EstateList /></ProtectedRoute>} />
                <Route path="/EstateInfo/:id" element={<ProtectedRoute><EstateInfoPage /> </ProtectedRoute>} />
                <Route path="/EstateEdit/:id" element={<ProtectedRoute><EstateEdit /> </ProtectedRoute>} />
                <Route path="/EstateMap" element={<ProtectedRoute><EstateMap /></ProtectedRoute>} />

                <Route path="/admin-dashboard" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
                <Route path="/user-dashboard" element={<ProtectedRoute role="User"><UserDashboard /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
