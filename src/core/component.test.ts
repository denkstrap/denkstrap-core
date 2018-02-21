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

class TestComponent extends Component {
    defaults() {
        return {
            test: true
        };
    }
}

describe( 'Component', () => {

    test( 'to be extensible', () => {
        expect( TestComponent.prototype ).toBeInstanceOf( Component );
    } );

    test( 'to register itself at its parentComponent', () => {
        new TestComponent( ComponentContext );
        expect( ParentComponentContext.$children ).toContain( ComponentContext );
    } );

    test( 'to have a ComponentContext', () => {
        const instance = new TestComponent( ComponentContext );
        expect( instance ).toMatchObject( ComponentContext );
    } );

    test( 'to transfer $data.options to $options', () => {
        const instance = new TestComponent( ComponentContext );
        expect( instance.$options ).toHaveProperty( 'foo' );
    } );

    test( 'to extend defaults() with $data.options to $options', () => {
        const instance = new TestComponent( ComponentContext );
        expect( instance.$options ).toHaveProperty( 'foo' );
        expect( instance.$options ).toHaveProperty( 'test' );
    } );

    test( 'to have a build chain', () => {
        const instance = new TestComponent( ComponentContext );
        expect( instance.chain() ).toEqual( [ 'ready', 'events' ] );
    } );

    test( 'to resolve the promise property when the build chain has finished execution', () => {
        return new Promise( ( resolve ) => {
            const instance = new TestComponent( ComponentContext );
            instance.then( resolve );
        } );
    } );

    test( 'to execute chained methods', () => {
        const readyMock = jest.fn();
        const eventsMock = jest.fn();

        class TestComponent7 extends Component {
            ready() {
                console.log( 'ready' );
                readyMock();
            }

            events() {
                eventsMock();
            }
        }

        const instance = new TestComponent7( ComponentContext );

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
