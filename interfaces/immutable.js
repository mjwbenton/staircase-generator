declare module 'immutable' {
    declare class RecordClass<T: Object> {
        construtor <T: Object>(spec: T): T & RecordClass<T>;
        static <T: Object>(spec: T): T & RecordClass<T>;
        // Not possible to provide a type safe setter, as no way to express it.
        set<A>(key: $Keys<T>, value: A): T & RecordClass<T>;
    }
    declare function Record<T: Object> (spec: T): Class<T & RecordClass<T>>;
}
