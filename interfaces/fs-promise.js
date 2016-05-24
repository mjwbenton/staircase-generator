declare module 'fs-promise' {
    declare interface LstatResult {
        isDirectory() : boolean;
    }
    declare function readdir(path : string) : Promise<Array<string>>;
    declare function lstat(path : string) : Promise<LstatResult>;
    declare function readFile(path : string, encoding : string)
            : Promise<string>;
    declare function mkdir(path : string) : Promise<void>;
    declare function writeFile(path : string, content : string) : Promise<void>;
}
