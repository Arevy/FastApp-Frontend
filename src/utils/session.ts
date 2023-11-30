import { UserData } from "src/AuthContext";

/**
 * Save data in Session Storage
 * @param {string} name - key for data
 * @param {string} data - data to store
 */
function saveSession(name: string, data: string): void {
	sessionStorage.setItem(name, data);
}

/**
 * Recover data from Session Storage
 * @param {string} name - key for data to recover
 * @returns {string | null} - Recovered data or null if not found
 */
function recoverSession(name: string): string | null {
	return sessionStorage.getItem(name);
}

/**
 * Delete all data in Session Storage
 */
function deleteSession(): void {
	sessionStorage.clear();
}

/**
 * Serialize and save user data in Session Storage
 * @param {string|number|Array|Object} data - data to store
 */
function storeUserDataOnSessionStorage(data: string | number | any[] | Record<string, any>): void {
	const replacer = (key: string, value: any) => {
		if (typeof value === 'boolean' || typeof value === 'number') {
			return String(value);
		}
		return value;
	};
	sessionStorage.setItem('userData', JSON.stringify(data, replacer));
}

/**
 * Recover and unserialize user data from Session Storage
 * @return {UserData}
 */
function recoverUserDataFromSessionStorage(): UserData {
	const reviver = (key: string, value: any) => {
		if (value === 'true') {
			return true;
		}
		if (value === 'false') {
			return false;
		}
		return value;
	};
	return JSON.parse(sessionStorage.getItem('userData') || '{}', reviver) as UserData;
}


/**
 * Delete user data in Session Storage
 */
function deleteUserDataFromSessionStorage(): void {
	sessionStorage.removeItem('userData');
}

export {
	saveSession,
	recoverSession,
	deleteSession,
	storeUserDataOnSessionStorage,
	recoverUserDataFromSessionStorage,
	deleteUserDataFromSessionStorage,
};
