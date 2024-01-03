import { createContext, useContext, useState } from "react";

const AuthContext = createContext()


const initialData = {
    username: localStorage.getItem('user') || "",
    role: localStorage.getItem('role') || "",
    isAuthenticated: false,
    avatar: null
}


export const AuthProvider = ({ children }) => {
    const [userdata, setUserData] = useState(initialData)
    const login = ( username, role, avatar) => {
        localStorage.setItem('user', JSON.stringify(username))
        localStorage.setItem('role', JSON.stringify(role))
        setUserData({
            ...userdata,  isAuthenticated: true, username: username, role: role, avatar: avatar
        })

    }

    const logout = () => {
        localStorage.removeItem('token', '')
        localStorage.removeItem('user', '')
        localStorage.removeItem('role', '')

        setUserData({ ...userdata, username: "", role: "", isAuthenticated: false })
    }

    return (
        <AuthContext.Provider value={{ userdata, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)