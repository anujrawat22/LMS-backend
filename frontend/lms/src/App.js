
import './App.css';
import AllRoutes from './components/AllRoutes';
import AdminSideNavBar from './components/SideNavBar/sidenavbar';
import { useEffect } from 'react';
import config from './config.json';
import { checkUserAuth } from './services/checkUserAuth.service';
import { useAuth } from './Contexts/AuthContext';
import { handleUserLogout } from './services/logout';


function App() {
  const { login } = useAuth()
  const checkUserAuthentication = async () => {
    try {
      const response = await checkUserAuth()
      let res = await response.json()
      if (response.status === 200) {
        const { name, role, avatar } = res.loggedInUser;
        login(name, role, avatar)
      } else if (response.status === 401) {
        refreshToken()
      } else {
        await handleUserLogout()
      }
    } catch (error) {
      await handleUserLogout()
    }
  }

  const refreshToken = async () => {
    const api = `${config.recurring.domainUrl}/${config.recurring.post.refreshAccessToken}`
    try {
      const res = await fetch(api, {
        method: "POST",
        credentials: 'include',
        headers: {
          'Content-type': "Application/json"
        }
      })
      const response = await res.json()
      console.log(response)
      if (res.status === 200) {
        const { name, role, avatar } = response.loggedInUser;
        login(name, role, avatar)
        
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    checkUserAuthentication()
  }, [])

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  return (
    <>
      <div style={{
        height: '100dvh',
        width: '100dvw',
        overflow: 'scroll',
        overflowX: 'hidden'
      }}>
        <AdminSideNavBar />
        <AllRoutes />
      </div>
    </>
  );
}

export default App;
