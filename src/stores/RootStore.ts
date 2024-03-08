import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { makeAutoObservable } from 'mobx';
import UserStore from './UserStore';
import ServiceStore from './ServiceStore';
import AppointmentStore from './AppointmentStore';
import AuthStore from './AuthStore';
// ... import other stores

class RootStore {
	userStore: UserStore;
	serviceStore: ServiceStore;
	appointmentStore: AppointmentStore;
	authStore: AuthStore;
	// ... other stores

	constructor(apolloClient: ApolloClient<NormalizedCacheObject>) {
		makeAutoObservable(this);
		this.authStore = new AuthStore(this);
		this.userStore = new UserStore(this, apolloClient);
		this.serviceStore = new ServiceStore(this, apolloClient);
		this.appointmentStore = new AppointmentStore(this, apolloClient);
		// ... initialize other stores
	}
}

export default RootStore;