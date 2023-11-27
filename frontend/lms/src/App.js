
import { Grid } from '@mui/material';
import './App.css';
import AllRoutes from './components/AllRoutes';
import AdminSideNavBar from './components/SideNavBar/sidenavbar';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';
import config from './config.json';






function App() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()
  const { userdata } = useAuth()
  const autoLogin = async (usertoken) => {
    try {
      const res = await fetch(`${config.recurring.domainUrl}/${config.recurring.post.autoLogin}`, {
        method: "Post",
        headers: {
          "Content-type": "application/json",
          Authorization: `bearer ${usertoken}`
        }
      }
      )
      const response = await res.json();
      const { token, username, role, avatar } = response;
      login(token, username, role, avatar)
      if (role === 'admin' || role === 'superadmin') {
        navigate("/admin/dashboard")
      } else if (role === 'user') {
        navigate("/courses")
      }
    } catch (error) {
      console.log(error)
      logout()
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined') {
      autoLogin(JSON.parse(token))
    } else {
      logout()
      navigate("/courses")
    }
  }, [])
  return (
    <>
      <Grid container sx={{ margin: 0, padding: 0 }}>
        <Grid item sm={1.2} xs={1.4} lg={.5} md={.9} sx={{ margin: 0, padding: 0}}>
          <AdminSideNavBar />
        </Grid>
        <Grid item sm={10.6} xs={10.6} lg={11.5} md={11.1} sx={{ margin: 0, padding: 0, overflow: 'scroll', overflowX: "hidden", height: '100dvh'}}>
          <AllRoutes />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
