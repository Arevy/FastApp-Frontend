import { makeAutoObservable, action, observable } from 'mobx';
import jwt from 'jsonwebtoken';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  saveSession,
  recoverSession,
  deleteSession,
  storeUserDataOnSessionStorage,
  recoverUserDataFromSessionStorage,
  deleteUserDataFromSessionStorage,
} from 'src/utils/session';
import RootStore from './RootStore';
import * as Mutations from 'src/gql/mutations/auth';

export interface UserData {
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  userName: string;
  _id: string;
}

class AuthStore {
  isAuth = !!recoverSession('token');
  userData: UserData;
  isLoading: boolean = false;
  error: Error | null | unknown | any = null;

  private apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(
    rootStore: RootStore,
    apolloClient: ApolloClient<NormalizedCacheObject>
  ) {
    makeAutoObservable(this, {
      userData: observable,
      loginUser: action,
      registerUser: action,
      activateAuth: action,
      removeAuth: action,
    });

    const recoveredUserData = recoverUserDataFromSessionStorage();
    this.userData = recoveredUserData || {
      email: '',
      userName: '',
      isAdmin: false,
      isActive: false,
      _id: '',
    };
    this.apolloClient = apolloClient;
  }

  async loginUser(email: string, password: string, userType:string) {
    this.isLoading = true;
    this.error = null;

    //userType will be used in the future
    
    try {
      const response = await this.apolloClient.mutate({
        mutation: Mutations.LOGIN,
        variables: { email, password },
      });

      const token = response.data?.authUser?.token;
      const user = response.data?.authUser?.user;

      if (token && user) {
        this.activateAuth(token, user);
      }

      this.isLoading = false;
      return response.data;
    } catch (error) {
      console.error('error', error);
      this.isLoading = false;
      this.error =
        error instanceof Error
          ? error
          : new Error('An unknown error occurred on login');
      throw error;
    }
  }

  async registerUser(
    email: string,
    password: string,
    userType: string,
    userName: string
  ) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await this.apolloClient.mutate({
        mutation: Mutations.REGISTER_USER,
        variables: { email, password, userType, userName },
      });

      const token = response.data?.registerUser?.token;
      const user = response.data?.registerUser?.user;

      if (token && user) {
        this.activateAuth(token, user);
      }

      this.isLoading = false;
    } catch (error) {
      console.error('error', error);
      this.isLoading = false;
      this.error =
        error instanceof Error
          ? error
          : new Error('An unknown error occurred on registration');
    }
  }

  async activateAuth(token: string, user: UserData) {
    const decodedToken = (jwt.decode(token) as Partial<UserData>) || {};
    const userData: UserData = {
      email: decodedToken.email || '',
      userName: decodedToken.email || '',
      isAdmin: !!decodedToken.isAdmin,
      isActive: !!decodedToken.isActive,
      _id: decodedToken._id || '',
    };
    //can use decde or directly from query response
    this.userData = {
      email: user.email || userData.email,
      userName: user.userName || userData.userName,
      isAdmin: user.isAdmin || userData.isAdmin,
      isActive: user.isActive || userData.isActive,
      _id: user._id || userData._id,
    };

    storeUserDataOnSessionStorage(this.userData);
    saveSession('token', token);
    this.isAuth = true;
  }

  removeAuth() {
    deleteUserDataFromSessionStorage();
    deleteSession();
    this.isAuth = false;
    this.userData = {
      email: '',
      userName: '',
      isAdmin: false,
      isActive: false,
      _id: '',
    };
  }
}

export default AuthStore;
