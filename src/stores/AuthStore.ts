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
  _id: string;  
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  userName: string;
  userType: string;
  serviceId: string;
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
      _id: '',
      email: '',
      userName: '',
      isAdmin: false,
      isActive: false,
      userType: '',
      serviceId: '',
    };
    this.apolloClient = apolloClient;
  }

  async loginUser(email: string, password: string, userType: string) {
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
    userName: string,
    serviceId?: string
  ) {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await this.apolloClient.mutate({
        mutation: Mutations.REGISTER_USER,
        variables: { email, password, userType, userName, serviceId },
      });

      const token = response.data?.registerUser?.token;
      const user = response.data?.registerUser?.user;

      if (token && user) {
        this.activateAuth(token, user);
      }

      this.isLoading = false;
      return user;
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
      _id: decodedToken._id || '',
      email: decodedToken.email || '',
      isAdmin: !!decodedToken.isAdmin,
      isActive: !!decodedToken.isActive,
      userType: decodedToken.userType || '',
      userName: decodedToken.userName || '',
      serviceId: decodedToken.serviceId || '',
    };

    this.userData = {
      _id:user._id || userData._id,
      email: user.email || userData.email,
      userName: user.userName || userData.userName,
      isAdmin: user.isAdmin || userData.isAdmin,
      isActive: user.isActive || userData.isActive,
      userType: user.userType || userData.userType,
      serviceId: user.serviceId || userData.serviceId,
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
      _id: '',
      email: '',
      userName: '',
      isAdmin: false,
      isActive: false,
      userType: '',
      serviceId: '',
    };
  }

  async updatePassword(_id: string, newPassword: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await this.apolloClient.mutate({
        mutation: Mutations.UPDATE_PASSWORD,
        variables: { _id, newPassword },
      });

      if (result.data.updatePassword.success) {
        console.log('Password updated successfully');
      } else {
        console.error(
          'Password update failed:',
          result.data.updatePassword.message
        );
      }

      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      console.error('Password update error:', error);
    }
  }

  async updateUserDetails(_id: string, email: string, userName: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await this.apolloClient.mutate({
        mutation: Mutations.UPDATE_USER_DETAILS,
        variables: { _id, email, userName },
      });

      if (result.data.updateUserDetails.success) {
        this.userData = {
          ...this.userData,
          email: result.data.updateUserDetails.user.email,
          userName: result.data.updateUserDetails.user.userName,
        };
        storeUserDataOnSessionStorage(this.userData);
        console.log('User details updated successfully');
      } else {
        console.error(
          'User details update failed:',
          result.data.updateUserDetails.message
        );
      }

      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      console.error('User details update error:', error);
    }
  }
}

export default AuthStore;
