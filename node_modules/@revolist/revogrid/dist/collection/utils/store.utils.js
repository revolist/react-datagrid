/**
* Global stores data
*/
import each from 'lodash/each';
function setStore(store, data) {
    each(data, (val, key) => {
        store.set(key, val);
    });
}
export { setStore };
