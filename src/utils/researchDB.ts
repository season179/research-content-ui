import { nanoid } from "nanoid";

export interface SearchResult {
    title: string;
    url: string;
    content: string;
}

export interface Article {
    type: string;
    content: string;
}

export interface ResearchEntry {
    id: string;
    originalQuery: string;
    refinedQuery: string | null;
    results: SearchResult[];
    createdAt: string;
    updatedAt: string;
    articles: Article[];
}

class ResearchDB {
    private dbName = "ResearchAssistantDB";
    private storeName = "researchData";
    private version = 2; // Increment version to trigger database upgrade

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
                    const store = db.createObjectStore(this.storeName, {
                        keyPath: "id",
                    });
                    store.createIndex("originalQuery", "originalQuery", {
                        unique: false,
                    });
                    store.createIndex("createdAt", "createdAt", {
                        unique: false,
                    });
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

    async createResearch(
        originalQuery: string,
        refinedQuery: string | null,
        results: SearchResult[]
    ): Promise<ResearchEntry> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);

            const timestamp = new Date().toISOString();
            const entry: ResearchEntry = {
                id: `TPC-${nanoid()}`,
                originalQuery,
                refinedQuery,
                results,
                createdAt: timestamp,
                updatedAt: timestamp,
                articles: [],
            };

            const request = store.add(entry);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(entry);
        });
    }

    async appendResults(
        id: string,
        newResults: SearchResult[]
    ): Promise<ResearchEntry> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);

            const getRequest = store.get(id);
            getRequest.onerror = () => reject(getRequest.error);
            getRequest.onsuccess = () => {
                const entry = getRequest.result as ResearchEntry;
                if (!entry) {
                    reject(new Error("Research entry not found"));
                    return;
                }

                entry.results = [...entry.results, ...newResults];
                entry.updatedAt = new Date().toISOString();

                const updateRequest = store.put(entry);
                updateRequest.onerror = () => reject(updateRequest.error);
                updateRequest.onsuccess = () => resolve(entry);
            };
        });
    }

    async addArticle(id: string, article: Article): Promise<ResearchEntry> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);

            const getRequest = store.get(id);
            getRequest.onerror = () => reject(getRequest.error);
            getRequest.onsuccess = () => {
                const entry = getRequest.result as ResearchEntry;
                if (!entry) {
                    reject(new Error("Research entry not found"));
                    return;
                }

                entry.articles.push(article);
                entry.updatedAt = new Date().toISOString();

                const updateRequest = store.put(entry);
                updateRequest.onerror = () => reject(updateRequest.error);
                updateRequest.onsuccess = () => resolve(entry);
            };
        });
    }

    async getResearch(id: string): Promise<ResearchEntry | null> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);

            const request = store.get(id);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result || null);
        });
    }
}

export const researchDB = new ResearchDB();
