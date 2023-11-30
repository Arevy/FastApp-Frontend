import { useState } from 'react';
import jwt from 'jsonwebtoken';
import {
    saveSession,
    recoverSession,
    deleteSession,
    storeUserDataOnSessionStorage,
    recoverUserDataFromSessionStorage,
    deleteUserDataFromSessionStorage
} from './utils/session';
import { AuthContextProviderProps, UserData, AuthContextValue, AuthContext } from './AuthContext';
import React from 'react';


export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [isAuth, setIsAuth] = useState<boolean>(() => !!recoverSession('token'));
    const [userData, setUserData] = useState<UserData>(() => recoverUserDataFromSessionStorage());

    const value: AuthContextValue = {
        isAuth,
        userData,
        activateAuth: (token) => {
            const decodedToken = jwt.decode(token) as Partial<UserData> || {};
            const userData = {
                email: decodedToken.email || '',
                isAdmin: !!decodedToken.isAdmin,
                isActive: !!decodedToken.isActive,
                uuid: decodedToken.uuid || '',
            };
            storeUserDataOnSessionStorage(userData);
            setUserData(userData);
            saveSession('token', token);
            setIsAuth(true);
        },
        removeAuth: () => {
            setIsAuth(false);
            setUserData({ email: '', isAdmin: false, isActive: false, uuid: '' });
            deleteUserDataFromSessionStorage();
            deleteSession();
        },
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
