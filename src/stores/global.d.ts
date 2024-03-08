// In global.d.ts
declare global {
    interface Window {
        store?: {
            rootStore: RootStore;
            // Define other stores if needed
        };
    }
}

export {};