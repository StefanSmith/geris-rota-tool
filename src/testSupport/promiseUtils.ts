export function hangingPromise<T>() {
    return new Promise<T>(() => {
    });
}

interface ControllablePromise<T> extends Promise<T> {
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void
}

export function controllablePromise<T>(): ControllablePromise<T> {
    let doResolve: (value: T) => void;
    let doReject: (reason?: unknown) => void;

    const promise = new Promise<T>((resolve, reject) => {
        doResolve = resolve;
        doReject = reject;
    });

    // @ts-expect-error monkey patching
    promise.resolve = (value: T) => doResolve(value);

    // @ts-expect-error monkey patching
    promise.reject = (reason?: unknown) => doReject(reason)

    return promise as ControllablePromise<T>;
}

export function promiseThatResolvesAfterMillis<T>(delayMillis: number, resolvedValue: T) {
    return new Promise<T>(resolve => setTimeout(() => resolve(resolvedValue), delayMillis));
}