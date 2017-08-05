declare module "async-disk-cache" {
    export default class AsyncDiskCache {
        constructor(x: string);
        get(x: string): Promise<{ isCached: boolean, value: any }>;
        set(x: string, v: any): Promise<void>;
    }
}