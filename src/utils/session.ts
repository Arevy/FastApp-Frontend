import { UserData } from 'src/stores/AuthStore';

// Assume AuthStore is provided as a global or through some context

function saveSession(name: string, data: string): void {
  sessionStorage.setItem(name, data);
}

function recoverSession(name: string): string | null {
  return sessionStorage.getItem(name);
}

function deleteSession(): void {
  sessionStorage.clear();
}

function storeUserDataOnSessionStorage(data: UserData): void {
  const replacer = (key: string, value: any) => {
    if (typeof value === 'boolean' || typeof value === 'number') {
      return String(value);
    }
    return value;
  };
  sessionStorage.setItem('userData', JSON.stringify(data, replacer));
}

function recoverUserDataFromSessionStorage(): UserData | null {
  const userDataString = sessionStorage.getItem('userData');
  if (!userDataString) {
    return null;
  }

  const reviver = (key: string, value: any) => {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return value;
  };

  return JSON.parse(userDataString, reviver) as UserData;
}

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
