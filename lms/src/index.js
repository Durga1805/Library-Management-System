// // LIBRARY_MANAGEMENT_SYSTEM\lms\src\index.js
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { RouterProvider } from 'react-router-dom';
// import router from './routes';
// // import { Provider  } from 'react-redux';
// // import { store } from './store/store';



// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//    <React.StrictMode>
//   {/* // <Provider store={store}> */}
//       <RouterProvider router={router}/>
//   {/* // </Provider> */}
//     </React.StrictMode> 
// );
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '620372328969-s4qlfqcnmkblfihp4iqj450187nd8lrn.apps.googleusercontent.com';
const redirectUri = "http://localhost:3000"



// Create root and render the application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

    {/* React Router v6 Setup */}
    <RouterProvider router={router} />
      </GoogleOAuthProvider>
  </React.StrictMode>
);

// Measuring performance (optional)
reportWebVitals();
