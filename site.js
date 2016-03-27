export default class Site {
    constructor(items) {
        this.items = items;
    }

    mapWithFilters(filters, map) {
        const newItems = this.items.map((item) => {
            const filtered = filters.some((filter) => {
                return filter(item);
            });
            console.log(item.path.toString());
            console.log(filtered);
            if (filtered) {
                return item;
            }
            return map(item);
        });
        return new Site(newItems);
    }
}
