export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  sourceUpdatedAt?: string;
  isStale?: boolean;
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private inFlight = new Map<string, Promise<unknown>>();

  get<T>(key: string, ttlMs: number): { data: T; isStale: boolean } | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const isStale = age >= ttlMs;
    return { data: entry.data, isStale };
  }

  set<T>(key: string, data: T, sourceUpdatedAt?: string): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      sourceUpdatedAt,
      isStale: false,
    });
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  getRaw<T>(key: string): CacheEntry<T> | null {
    const entry = this.store.get(key);
    return entry ? (entry as CacheEntry<T>) : null;
  }

  /**
   * Fetches data with in-flight deduplication and stale-while-revalidate.
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number,
    forceFresh = false,
  ): Promise<{ data: T | null; isStale: boolean; fetchedAt: string }> {
    const cached = this.get<T>(key, ttlMs);

    if (!forceFresh && cached && !cached.isStale) {
      return {
        data: cached.data,
        isStale: false,
        fetchedAt: new Date(this.store.get(key)!.timestamp).toISOString(),
      };
    }

    // If request already in flight for this key, join it
    if (this.inFlight.has(key)) {
      try {
        const result = (await this.inFlight.get(key)) as T;
        return {
          data: result,
          isStale: false,
          fetchedAt: new Date().toISOString(),
        };
      } catch {
        if (cached) {
          return {
            data: cached.data,
            isStale: true,
            fetchedAt: new Date(this.store.get(key)!.timestamp).toISOString(),
          };
        }
      }
    }

    const promise = (async () => {
      try {
        const fresh = await fetcher();
        if (fresh !== null && fresh !== undefined) {
          this.set(key, fresh);
        }
        return fresh;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);

    try {
      const fresh = await promise;
      return {
        data: fresh,
        isStale: false,
        fetchedAt: new Date().toISOString(),
      };
    } catch (error) {
      // Fallback to stale cached data if fetch failed
      if (cached) {
        return {
          data: cached.data,
          isStale: true,
          fetchedAt: new Date(this.store.get(key)!.timestamp).toISOString(),
        };
      }
      return {
        data: null,
        isStale: true,
        fetchedAt: new Date().toISOString(),
      };
    }
  }

  clear(): void {
    this.store.clear();
    this.inFlight.clear();
  }
}

export const globalCache = new MemoryCache();
