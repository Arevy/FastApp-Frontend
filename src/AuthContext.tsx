import { createContext, ReactNode } from 'react';

import { AuthContextProvider } from './AuthContextProvider';

export interface UserData {
	email: string;
	isAdmin: boolean;
	isActive: boolean;
	uuid: string;
}

export interface AuthContextValue {
	isAuth: boolean;
	userData: UserData;
	activateAuth: (token: string) => void;
	removeAuth: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
	isAuth: false,
	userData: { email: '', isAdmin: false, isActive: false, uuid: '' },
	activateAuth: (token: string) => { },
	removeAuth: () => { },
});

export interface AuthContextProviderProps {
	children: ReactNode;
}

export default AuthContextProvider;
