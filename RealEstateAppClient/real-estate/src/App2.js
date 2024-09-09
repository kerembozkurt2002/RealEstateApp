// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AdminPage from './components/AdminPage';
// import UserPage from './components/UserPage';
// import HomePage from './components/HomePage';
// import Login from './components/Login';
// import PrivateRoute from './components/PrivateRoute';
// import { AuthProvider } from './components/AuthContext';
// import SignUp from './components/Sign/SignUp';
// import SignIn from './components/Sign/SignIn';

// const App = () => (
    
//   <AuthProvider>
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route 
//           path="/admin" 
//           element={
//             <PrivateRoute roles={['Admin']}>
//               <AdminPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route 
//           path="/user" 
//           element={
//             <PrivateRoute roles={['User', 'Admin']}>
//               <UserPage />
//             </PrivateRoute>
//           } 
//         />
//         <Route path="/" element={<HomePage />} />
//       </Routes>
//     </Router>
//   </AuthProvider>
// );

// export default App;
