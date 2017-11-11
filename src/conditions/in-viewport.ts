import { ICondition } from './index';

/**
 * inViewport condition
 * Initialize a module when it appears in the viewport
 * @param {Function} load Use to load module
 * @param {Element} element Element on which the module was initialized
 * @type {Function}
 * @implements ICondition
 */
export const inViewport: ICondition = ( load, element ) => {

    const handleIntersect = ( entries: IntersectionObserverEntry[], observer: IntersectionObserver ) => {
        entries.forEach( (entry: IntersectionObserverEntry) => {
            if ( entry.intersectionRatio > 0 ) {
                observer.unobserve( entry.target );
                load();
            }
        } );
    };

    const observer = new IntersectionObserver( handleIntersect, {
        root: document.body
    } );

    observer.observe( element );
};
