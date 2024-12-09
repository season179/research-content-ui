interface ApiKeys {
    openai: string;
    tavily: string;
}

class ApiKeyDB {
    private dbName = "ResearchAssistantDB";
    private storeName = "apiKeys";
    private version = 2;

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    private async getDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    }

    async getApiKeys(): Promise<ApiKeys> {
        await this.init();
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const keys: Partial<ApiKeys> = {};

            const openaiRequest = store.get("openai");
            const tavilyRequest = store.get("tavily");

            openaiRequest.onsuccess = () => {
                keys.openai = openaiRequest.result || "";
            };

            tavilyRequest.onsuccess = () => {
                keys.tavily = tavilyRequest.result || "";
            };

            transaction.oncomplete = () => {
                resolve({
                    openai: keys.openai || "",
                    tavily: keys.tavily || "",
                });
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }

    async saveApiKeys(keys: ApiKeys): Promise<void> {
        await this.init();
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);

            store.put(keys.openai, "openai");
            store.put(keys.tavily, "tavily");

            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }

    async deleteApiKeys(): Promise<void> {
        await this.init();
        const db = await this.getDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);

            store.delete("openai");
            store.delete("tavily");

            transaction.oncomplete = () => {
                resolve();
            };

            transaction.onerror = () => {
                reject(transaction.error);
            };
        });
    }
}

export const apiKeyDB = new ApiKeyDB();
