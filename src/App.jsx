import { useState , useRef} from 'react'
import { createBrowserRouter ,RouterProvider,Navigate} from 'react-router-dom';
import Room from './assets/pages/Room';
import ProtextedRoutes from './assets/routes/ProtextedRoutes';
import CodeCollab from './assets/pages/LandingPage';
import Dashboard from './assets/pages/Dashboard';
import LoginPage from './assets/pages/Login';
import SignUpPage from './assets/pages/Sign';
import { ProtectRooms } from './assets/routes/ProtextedRoutes';


function App() {
   const [room,setRoom]=useState(false)
   const routes=createBrowserRouter([
    {path:'/',element:<CodeCollab/>},
    {path:'/login',element:<LoginPage/>},
    {path:'/signUp',element:<SignUpPage/>},
    {path:'/dashboard',element:<ProtextedRoutes><Dashboard/></ProtextedRoutes>},
    {path:'/room',element:<ProtectRooms><Room/></ProtectRooms>},
    {path:'*',element:<Navigate to="/"/>}
   ])

  return (
      <RouterProvider router={routes} >
      </RouterProvider>
  );
}

export default App
