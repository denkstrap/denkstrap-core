import conditions from './index';

describe( 'inViewport', () => {

    test( 'to comply condition', () => {
        // https://gist.github.com/rhysd/cb83ab616211f271bc73186416a30811
        // https://www.w3.org/TR/2017/WD-intersection-observer-20170914/

        interface IntersectionObserverEntry {
            readonly target: Element;
            isIntersecting: boolean
        }

        type IntersectionObserverCallback =
            ( entries: IntersectionObserverEntry[], observer: IntersectionObserver ) => void;

        interface IntersectionObserverInit {
            root?: Element | null;
            rootMargin?: string;
            threshold?: number;
        }

        class IntersectionObserver {
            readonly callback: IntersectionObserverCallback;
            constructor( callback: IntersectionObserverCallback, options?: IntersectionObserverInit ) {
                this.callback = callback;
            }
            observe( target: Element ): void {
                let ary = [];
                let obj: IntersectionObserverEntry = {
                    target: target,
                    isIntersecting: true
                };
                ary[ 0 ] = obj;
                let callback = () => {};
                let observer = new IntersectionObserver( callback );
                this.callback( ary, observer );
            }
            unobserve( target: Element ): void {}
            disconnect(): void {}
        }

        Object.defineProperty(
            window,
            'IntersectionObserver',
            {
                value: IntersectionObserver,
                writable: true
            }
        );

        const load = jest.fn();
        let inViewEl = document.body;

        conditions.inViewport( load, inViewEl );
        expect( load.mock.calls.length ).toBe( 1 );
    } );

    test( 'to not comply condition', () => {

        interface IntersectionObserverEntry {
            readonly target: Element;
            isIntersecting: boolean
        }

        type IntersectionObserverCallback =
            ( entries: IntersectionObserverEntry[], observer: IntersectionObserver ) => void;

        interface IntersectionObserverInit {
            root?: Element | null;
            rootMargin?: string;
            threshold?: number;
        }

        class IntersectionObserver {
            readonly callback: IntersectionObserverCallback;
            constructor( callback: IntersectionObserverCallback, options?: IntersectionObserverInit ) {
                this.callback = callback;
            }
            observe( target: Element ): void {
                let ary = [];
                let obj: IntersectionObserverEntry = {
                    target: target,
                    isIntersecting: false
                };
                ary[ 0 ] = obj;
                let callback = () => {};
                let observer = new IntersectionObserver( callback );
                this.callback( ary, observer );
            }
            unobserve( target: Element ): void {}
            disconnect(): void {}
        }

        Object.defineProperty(
            window,
            'IntersectionObserver',
            {
                value: IntersectionObserver
            }
        );

        const load = jest.fn();
        let inViewEl = document.body;
        conditions.inViewport( load, inViewEl );
        expect( load.mock.calls.length ).toBe( 0  );
    } );

} );
