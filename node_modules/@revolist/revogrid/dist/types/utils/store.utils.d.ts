/**
* Global stores data
*/
import { ObservableMap } from '@stencil/store';
declare function setStore<T extends {
    [key: string]: any;
}>(store: ObservableMap<T>, data: Partial<T>): void;
export { setStore };
