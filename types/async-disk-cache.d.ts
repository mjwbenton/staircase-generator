declare module "async-disk-cache" {
    namespace AsyncDiskCache {}
    class AsyncDiskCache {
        constructor(x: string);
        get(x: string): Promise<{ isCached: boolean, value: any }>;
        set(x: string, v: any): Promise<void>;
        clear(): Promise<void>;
    }
    export = AsyncDiskCache;
}