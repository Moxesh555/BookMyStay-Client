// import {
//   BrowserRouter,
//   Routes,
//   Route,
// } from "react-router-dom";
// import Home from "./pages/home/Home";
// import Hotel from "./pages/hotel/Hotel";
// import List from "./pages/list/List";
// import Login from "./pages/login/Login";
// import Register from "./pages/Register/register";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home/>}/>
//         <Route path="/hotels" element={<List/>}/>
//         <Route path="/hotels/:id" element={<Hotel/>}/>
//         <Route path="/login" element={<Login/>}/>
//         <Route path="/register" element={<Register/>}/>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/Register/register";
import {gapi} from 'gapi-script'
const App = () => {
  useEffect(() => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '434020687133-j0ilpsbu27i0imfh8975bmf7fi7soigk.apps.googleusercontent.com',
      });
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/hotels" element={<List/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
