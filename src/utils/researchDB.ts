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

/**
 * Database version history:
 * 1: Initial version with basic research storage
 * 2: Added articles array to store generated content
 */
class ResearchDB {
    private dbName = "ResearchAssistantDB";
    private storeName = "researchData";
    private version = 2; // Increment version to trigger database upgrade

    /**
     * Handles database errors by logging the error and throwing a new error.
     * @param error The error to handle.
     * @param reject The reject callback.
     */
    private handleError(
        error: Error | DOMException | null,
        reject: (error: Error) => void
    ): never {
        if (error === null) {
            const err = new Error("Database operation failed: Unknown error");
            console.error("Database error: Unknown error");
            reject(err);
            throw err;
        } else {
            const message = error.message || "Unknown database error";
            const err = new Error(`Database operation failed: ${message}`);
            console.error(`Database error: ${message}`, error);
            reject(err);
            throw err;
        }
    }

    /**
     * Initializes the research database.
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => this.handleError(request.error, reject);

            request.onsuccess = () => {
                console.log("Research database initialized successfully");
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

    /**
     * Gets a reference to the research database.
     */
    private async getDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onerror = () => this.handleError(request.error, reject);
            request.onsuccess = () => resolve(request.result);
        });
    }

    /**
     * Retries a database operation with exponential backoff
     * @param operation The operation to retry
     * @param maxRetries Maximum number of retry attempts
     */
    private async retryOperation<T>(
        operation: () => Promise<T>,
        maxRetries: number = 3
    ): Promise<T> {
        let lastError: Error | null = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error as Error;
                if (attempt === maxRetries) break;
                await new Promise((resolve) =>
                    setTimeout(resolve, Math.pow(2, attempt) * 100)
                );
            }
        }
        throw lastError;
    }

    /**
     * Executes a database operation within a transaction
     * @param mode Transaction mode (readonly or readwrite)
     * @param operation The operation to execute
     */
    private async withTransaction<T>(
        mode: IDBTransactionMode,
        operation: (store: IDBObjectStore) => Promise<T>
    ): Promise<T> {
        const db = await this.getDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, mode);
            const store = transaction.objectStore(this.storeName);

            transaction.onerror = () =>
                this.handleError(transaction.error, reject);
            transaction.onabort = () =>
                this.handleError(transaction.error, reject);

            Promise.resolve(operation(store))
                .then(resolve)
                .catch((error) => this.handleError(error, reject));
        });
    }

    /**
     * Creates a new research entry.
     * @param originalQuery The original query.
     * @param refinedQuery The refined query.
     * @param results The search results.
     */
    async createResearch(
        originalQuery: string,
        refinedQuery: string | null,
        results: SearchResult[]
    ): Promise<ResearchEntry> {
        return this.retryOperation(() =>
            this.withTransaction("readwrite", (store) => {
                return new Promise((resolve, reject) => {
                    const entry: ResearchEntry = {
                        id: `TPC-${nanoid()}`,
                        originalQuery,
                        refinedQuery,
                        results,
                        articles: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    const request = store.add(entry);
                    request.onerror = () =>
                        this.handleError(request.error, reject);
                    request.onsuccess = () => resolve(entry);
                });
            })
        );
    }

    /**
     * Appends new search results to an existing research entry.
     * @param id The ID of the research entry.
     * @param newResults The new search results.
     */
    async appendResults(
        id: string,
        newResults: SearchResult[]
    ): Promise<ResearchEntry> {
        return this.retryOperation(() =>
            this.withTransaction("readwrite", (store) => {
                return new Promise((resolve, reject) => {
                    const getRequest = store.get(id);
                    getRequest.onerror = () =>
                        this.handleError(getRequest.error, reject);
                    getRequest.onsuccess = () => {
                        const entry = getRequest.result as ResearchEntry;
                        if (!entry) {
                            this.handleError(
                                new Error("Research entry not found"),
                                reject
                            );
                            return;
                        }

                        entry.results = [...entry.results, ...newResults];
                        entry.updatedAt = new Date().toISOString();

                        const updateRequest = store.put(entry);
                        updateRequest.onerror = () =>
                            this.handleError(updateRequest.error, reject);
                        updateRequest.onsuccess = () => resolve(entry);
                    };
                });
            })
        );
    }

    /**
     * Adds a new article to an existing research entry.
     * @param id The ID of the research entry.
     * @param article The article to add.
     */
    async addArticle(id: string, article: Article): Promise<ResearchEntry> {
        return this.retryOperation(() =>
            this.withTransaction("readwrite", (store) => {
                return new Promise((resolve, reject) => {
                    const getRequest = store.get(id);
                    getRequest.onerror = () =>
                        this.handleError(getRequest.error, reject);
                    getRequest.onsuccess = () => {
                        const entry = getRequest.result as ResearchEntry;
                        if (!entry) {
                            this.handleError(
                                new Error("Research entry not found"),
                                reject
                            );
                            return;
                        }

                        entry.articles.push(article);
                        entry.updatedAt = new Date().toISOString();

                        const updateRequest = store.put(entry);
                        updateRequest.onerror = () =>
                            this.handleError(updateRequest.error, reject);
                        updateRequest.onsuccess = () => resolve(entry);
                    };
                });
            })
        );
    }

    /**
     * Retrieves a research entry by ID.
     * @param id The ID of the research entry.
     */
    async getResearch(id: string): Promise<ResearchEntry | null> {
        return this.retryOperation(() =>
            this.withTransaction("readonly", (store) => {
                return new Promise((resolve, reject) => {
                    const request = store.get(id);
                    request.onerror = () =>
                        this.handleError(request.error, reject);
                    request.onsuccess = () => resolve(request.result || null);
                });
            })
        );
    }
}

export const researchDB = new ResearchDB();
