declare module "yaml-front-matter" {
    function loadFront(content: string): { [key: string]: any };
}