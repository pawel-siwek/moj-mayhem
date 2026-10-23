interface Entry<T> {
	value: T;
	expires: number;
}

export class TtlCache<T> {
	private store = new Map<string, Entry<T>>();
	private inFlight = new Map<string, Promise<T>>();

	constructor(
		private ttlMs: number,
		private maxEntries = 500,
	) {}

	get(key: string): T | undefined {
		const entry = this.store.get(key);
		if (!entry) return undefined;
		if (entry.expires <= Date.now()) {
			this.store.delete(key);
			return undefined;
		}
		return entry.value;
	}

	set(key: string, value: T): void {
		if (this.store.size >= this.maxEntries && !this.store.has(key)) {
			const oldest = this.store.keys().next().value;
			if (oldest !== undefined) this.store.delete(oldest);
		}
		this.store.set(key, { value, expires: Date.now() + this.ttlMs });
	}

	/** Łączy równoległe wywołania dla tego samego klucza w jedno. */
	dedupe(key: string, load: () => Promise<T>): Promise<T> {
		const pending = this.inFlight.get(key);
		if (pending) return pending;
		const promise = load().finally(() => this.inFlight.delete(key));
		this.inFlight.set(key, promise);
		return promise;
	}
}
