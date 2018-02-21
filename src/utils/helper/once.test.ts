import { once } from './once';

describe( 'once', () => {

    test( 'to call wrapped functions just once', () => {
        const testFn = jest.fn();
        const onceWrappedTestFn = once( testFn );

        onceWrappedTestFn();
        onceWrappedTestFn();

        expect( testFn.mock.calls.length ).toBe( 1 );
    } );

    test( 'to return return values from wrapped function', () => {
        const returnValue = 'test';
        const testFn = () => returnValue;
        const onceWrappedTestFn = once( testFn );

        let result = onceWrappedTestFn();

        expect( result ).toBe( returnValue );
    } );

} );
