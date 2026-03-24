import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credits, setCredits] = useState(false);

    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const loadCredits = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/credits', {
                headers: { token }
            })
            if(data.success) {
                setCredits(data.credits);
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/image/generate-image', 
                { prompt },
                { headers: { token } }
            )
            if(data.success) {
                loadCredits();
                return data.generatedImage;
            } else {
                toast.error(data.message);
                loadCredits();
                if(data.creditsBalance === 0) {
                    navigate('/buy-credits');
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(false);
    }

    useEffect(() => {
        if(token) {
            loadCredits();
        }
    }, [token])
    
    const value = {
        user, 
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credits,
        setCredits,
        loadCredits,
        logout,
        generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;