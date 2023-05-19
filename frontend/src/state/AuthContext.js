import {createContext, useEffect, useReducer} from "react";
import AuthReducer from "./AuthReducer";

//最初のユーザー状態
const initialState = {
    user:JSON.parse(localStorage.getItem("user")) || null,
    // user: {
    //     _id:"63e26134b58066aa5c3a45ef",
    //     username:"shincode",
    //     email:"shincode@gmail.com",
    //     password:"abcdef",
    //     profilePicture:"/person/1.jpeg",
    //     coverPicture:"",
    //     followers:[],
    //     followings:[],
    // },
    isFetching: false,
    error: false,
};

//状態をグローバル管理
export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
    },[state.user]);

    return <AuthContext.Provider value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
    }}>
    {children}
    </AuthContext.Provider>;
}