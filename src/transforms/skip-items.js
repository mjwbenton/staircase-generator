export function skipDirectories(item) {
    return item.isDirectory();
}

export function skipMeta(item) {
    return item.getFileName() === 'meta.yaml';
}
