import { Condition } from '../index.d';

/**
 * inViewport condition
 * Initialize a module when it appears in the viewport
 * @param {Function} load Use to load module
 * @param {Element} element Element on which the module was initialized
 * @type {Function}
 * @implements Condition
 */
export const inViewport: Condition = ( load, element ) => {

    const handleIntersect: IntersectionObserverCallback = ( entries: IntersectionObserverEntry[], observer: IntersectionObserver ) => {
        entries.forEach( ( entry: IntersectionObserverEntry ) => {
            if ( entry.isIntersecting ) {
                observer.unobserve( entry.target );
                load();
            }
        } );
    };

    const observer = new IntersectionObserver( handleIntersect, {
        threshold: 0.25
    } );

    observer.observe( element );
};
