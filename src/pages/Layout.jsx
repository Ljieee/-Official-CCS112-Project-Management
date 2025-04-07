import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';


function Layout() {
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
  
      <Navbar />

    <div className="flex-grow container mx-auto p-8">
        <Outlet />
     </div>
    </div>
  );
}

export default Layout;
