declare module 'filepath' {
    declare interface FilePath {
        valueOf() : string;
        basename() : string;
        append(path : string) : FilePath;
        relative(path : string) : string;
    }
    declare function create(path : string) : FilePath;
}
