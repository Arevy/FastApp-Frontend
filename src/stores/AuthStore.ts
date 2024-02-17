import { makeAutoObservable } from 'mobx';
import jwt from 'jsonwebtoken';
import {
    saveSession,
    recoverSession,
    deleteSession,
    storeUserDataOnSessionStorage,
    recoverUserDataFromSessionStorage,
    deleteUserDataFromSessionStorage
} from '../utils/session'; // Adjust the import path as needed
import RootStore from './RootStore';

export interface UserData {
    email: string;
    isAdmin: boolean;
    isActive: boolean;
    uuid: string;
}

class AuthStore {
    isAuth = !!recoverSession('token');
    userData: UserData;
    private rootStore: RootStore;
    // private apolloClient: ApolloClient<NormalizedCacheObject>;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
        const recoveredUserData = recoverUserDataFromSessionStorage();
        this.userData = recoveredUserData || { email: '', isAdmin: false, isActive: false, uuid: '' };
    }

    activateAuth(token: string) {
        const decodedToken = jwt.decode(token) as Partial<UserData> || {};
        const userData: UserData = {
            email: decodedToken.email || '',
            isAdmin: !!decodedToken.isAdmin,
            isActive: !!decodedToken.isActive,
            uuid: decodedToken.uuid || '',
        };

        storeUserDataOnSessionStorage(userData);
        saveSession('token', token);
        this.userData = userData;
        this.isAuth = true;
    }

    removeAuth() {
        deleteUserDataFromSessionStorage();
        deleteSession();
        this.isAuth = false;
        this.userData = { email: '', isAdmin: false, isActive: false, uuid: '' };
    }
}

export default AuthStore;