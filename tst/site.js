import test from 'tape'
import Site from '../src/site';

test('Site', (t) => {

    t.test('#mapWithFilters', (st) => {
        {
            const site = new Site([1,2,3,4]).mapWithFilters([], (x) => x*2);
            st.deepEquals(site.items, [2,4,6,8], "map applies to all items with no filters");
        }
        {
            const site = new Site([1,2,3,4]).mapWithFilters([(x) => x < 2, (x) => x > 3], (x) => x*2);
            st.deepEquals(site.items, [1, 4, 6, 4], "map only applies to unfiltered items");
        }
        st.end();
    });

});
