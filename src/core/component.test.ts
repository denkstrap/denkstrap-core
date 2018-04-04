import { Component } from './component';

const ParentComponentContext = {
    $element: document.body,
    $components: [ 'test-parent' ],
    $data: {},
    $children: []
};

const ComponentContext = {
    $element: document.body,
    $components: [ 'test' ],
    $parentComponent: ParentComponentContext,
    $data: {
        options: {
            foo: 'bar'
        }
    },
    $children: []
};

const defaults = {
    test: true
};

describe( 'Component', () => {

    test( 'to be extensible', () => {
        class TestComponent1 extends Component {}
        expect( TestComponent1.prototype ).toBeInstanceOf( Component );
    } );

    test( 'to register itself at its parentComponent', () => {
        class TestComponent2p1 extends Component {}
        let testComponent2p1 = new TestComponent2p1( ComponentContext );
        class TestComponent2p2 extends Component {}
        let testComponent2p2 = new TestComponent2p2( { ...ComponentContext, ...{ $parentComponent: undefined } } );
        expect( ParentComponentContext.$children ).toContain( ComponentContext );
        expect( ParentComponentContext.$children ).toHaveLength( 1 );
    } );

    test( 'to have a ComponentContext', () => {
        class TestComponent3 extends Component {}
        const instance = new TestComponent3( ComponentContext );
        expect( instance ).toMatchObject( ComponentContext );
    } );

    test( 'to transfer $data.options to $options', () => {
        class TestComponent4 extends Component {}
        const instance = new TestComponent4( ComponentContext );
        expect( instance.$options ).toHaveProperty( 'foo' );
    } );

    test( 'to extend defaults() with $data.options to $options', () => {
        class TestComponent5 extends Component {
            defaults() {
                return defaults;
            }
        }
        const instance = new TestComponent5( ComponentContext );
        expect( instance.$options ).toMatchObject( { ...defaults, ...ComponentContext.$data.options } );
    } );

    test( 'to have a build chain', () => {
        class TestComponent6 extends Component {}
        const instance = new TestComponent6( ComponentContext );
        expect( instance.chain() ).toEqual( [ 'ready', 'events' ] );
    } );

    test( 'to resolve the promise property when the build chain has finished execution', () => {
        class TestComponent7 extends Component {}
        return new Promise( ( resolve ) => {
            const instance = new TestComponent7( ComponentContext );
            instance.then( resolve );
        } );
    } );

    test( 'to execute chained methods', () => {
        const readyMock = jest.fn();
        const eventsMock = jest.fn();

        class TestComponent8 extends Component {
            ready() {
                readyMock();
            }

            events() {
                eventsMock();
            }
        }

        const instance = new TestComponent8( ComponentContext );

        instance.then( () => {
            expect( readyMock ).toHaveBeenCalledTimes( 1 );
            expect( eventsMock ).toHaveBeenCalledTimes( 1 );
        } );

    } );

    test( 'to await async methods of the chain before continuing execution', () => {
        let test = false;

        class TestComponent9 extends Component {
            ready() {
                return new Promise( ( resolve ) => {
                    setTimeout( () => {
                        test = true;
                        resolve();
                    }, 500 );
                } );
            }

            events() {
                expect( test ).toBe( true );
            }
        }

        return new Promise( ( resolve ) => {
            const instance = new TestComponent9( ComponentContext );
            instance.then( resolve );
        } );
    } );

    test( 'to log an error if an async method of the chain is rejected', () => {
        const spy = jest.spyOn( console, 'error' ).mockImplementation( jest.fn() );

        class TestComponent10 extends Component {
            ready() {
                return new Promise( ( resolve, reject ) => {
                    reject();
                } );
            }
        }

        return new Promise( ( resolve ) => {
            const instance = new TestComponent10( ComponentContext );
            instance.then( () => {
                expect( spy ).toHaveBeenCalledTimes( 1 );
                resolve();
            } );
        } );
    } );

    test( 'to pass returned values into the next chain method', () => {
        class TestComponent11 extends Component {
            ready() {
                return new Promise( ( resolve ) => {
                    resolve( { foo: 'bar' } );
                } );
            }

            events( payload: any ) {
                expect( payload ).toMatchObject( { foo: 'bar' } );
            }
        }

        return new Promise( ( resolve ) => {
            const instance = new TestComponent11( ComponentContext );
            instance.then( resolve );
        } );
    } );

} );
