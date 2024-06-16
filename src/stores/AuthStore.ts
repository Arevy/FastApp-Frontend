import { makeAutoObservable, toJS } from 'mobx';
import jwt from 'jsonwebtoken';
import {
  ApolloClient,
  NormalizedCacheObject,
  ObservableQuery,
} from '@apollo/client';
import {
  saveSession,
  recoverSession,
  deleteSession,
  storeUserDataOnSessionStorage,
  recoverUserDataFromSessionStorage,
  deleteUserDataFromSessionStorage,
} from '../utils/session'; // Adjust the import path as needed
import RootStore from './RootStore';
import * as Mutations from 'src/gql/mutations/auth';

export interface UserData {
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  _id: string;
}

class AuthStore {
  isAuth = !!recoverSession('token');
  userData: UserData;
  isLoading: boolean = false;
  error: Error | null | unknown | any = null;

  private rootStore: RootStore;
  private apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(
    rootStore: RootStore,
    apolloClient: ApolloClient<NormalizedCacheObject>
  ) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    const recoveredUserData = recoverUserDataFromSessionStorage();
    this.userData = recoveredUserData || {
      email: '',
      isAdmin: false,
      isActive: false,
      _id: '',
    };
    this.apolloClient = apolloClient;
  }

  async loginUser(email: string, password: string, userType: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await this.apolloClient.mutate({
        mutation: Mutations.LOGIN,
        variables: { email, password, userType },
      });

      const token = response.data?.authUser?.token;
      if (token) {
        this.activateAuth(token);
      }
      this.isLoading = false;

      return response.data;
    } catch (error) {
      console.log('error', error);
      this.isLoading = false;
      this.error =
        error instanceof Error
          ? error
          : new Error('An unknown error occurred on login');
      throw error;
    }
  }

  async registerUser(email: string, password: string, userType: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await this.apolloClient.mutate({
        mutation: Mutations.REGISTER_USER,
        variables: { email, password, userType },
      });

      const token = response.data?.registerUser?.token;
      if (token) {
        this.activateAuth(token);
      }
      console.log('token', token, response.data?.registerUser?.token);
      this.isLoading = false;
    } catch (error) {
      console.log('error', error);
      this.isLoading = false;
      this.error =
        error instanceof Error
          ? error
          : new Error('An unknown error occurred on registration');
    }
  }

  async activateAuth(token: string) {
    console.log(
      'userData',
      jwt.decode(token) as Partial<UserData>,
      toJS(this.userData)
    );
    const decodedToken = (jwt.decode(token) as Partial<UserData>) || {};
    const userData: UserData = {
      email: decodedToken.email || '',
      isAdmin: !!decodedToken.isAdmin,
      isActive: !!decodedToken.isActive,
      _id: decodedToken._id || '',
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
    this.userData = { email: '', isAdmin: false, isActive: false, _id: '' };
  }
}

export default AuthStore;
