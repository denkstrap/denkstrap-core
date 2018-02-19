import { Dispatcher } from './dispatcher';

const TEST_EVENT_NAME = 'testEventName';
const TEST_EVENT_NAME_NS1 = 'testArg1Content.ns1';
const TEST_EVENT_NAME_NS2 = 'testArg1Content.ns1.ns2';
const TEST_EVENT2_NAME_NS1 = 'testArg2Content.ns1';
const TEST_EVENT2_NAME_NS2 = 'testArg2Content.ns1.ns2';
const TEST_ARG1_CONTENT = 'testArg1Content';
const TEST_ARG2_CONTENT = 'testArg2Content';

describe( 'Dispatcher', () => {

    describe( '.trigger', () => {

        test( 'to dispatch an event', () => {
            const dispatcher = new Dispatcher();
            const mockFunction = jest.fn();

            dispatcher.on( TEST_EVENT_NAME, mockFunction);

            dispatcher.trigger( TEST_EVENT_NAME  );

            expect( mockFunction.mock.calls.length ).toBe( 1 );
        } );

        test( 'to dispatch multiple events', () => {
            const dispatcher = new Dispatcher();
            const mockFunction = jest.fn();

            dispatcher.on( TEST_EVENT_NAME, mockFunction);

            dispatcher.trigger( TEST_EVENT_NAME  );
            dispatcher.trigger( TEST_EVENT_NAME  );

            expect( mockFunction.mock.calls.length ).toBe( 2 );
        } );

        test( 'to pass an argument', () => {
            const dispatcher = new Dispatcher();

            dispatcher.on( TEST_EVENT_NAME, ( event, arg ) => {
                expect( arg ).toBe( TEST_ARG1_CONTENT );
            } );

            dispatcher.trigger( TEST_EVENT_NAME, [ TEST_ARG1_CONTENT ] );
        } );

        test( 'to pass multiple arguments', () => {
            const dispatcher = new Dispatcher();

            dispatcher.on( TEST_EVENT_NAME, ( event, arg1, arg2 ) => {
                expect( arg1 ).toBe( TEST_ARG1_CONTENT );
                expect( arg2 ).toBe( TEST_ARG2_CONTENT );
            } );

            dispatcher.trigger( TEST_EVENT_NAME, [
                TEST_ARG1_CONTENT,
                TEST_ARG2_CONTENT
            ] );
        } );

        test( 'to pass a context', () => {
            const dispatcher = new Dispatcher();
            const context = {
                foo: 'bar'
            };

            dispatcher.on( TEST_EVENT_NAME, function(this: any) {
                expect( this ).toBe( context );
            } );

            dispatcher.trigger( TEST_EVENT_NAME, [], context );
        } );

    } );


    describe( '.on', () => {

        test( 'to subscribe an event and react on an event', () => {
            const dispatcher = new Dispatcher();
            const mockFunction = jest.fn();

            dispatcher.on( TEST_EVENT_NAME, mockFunction);

            dispatcher.trigger( TEST_EVENT_NAME  );

            expect( mockFunction.mock.calls.length ).toBe( 1 );
        } );

        test( 'to subscribe and react multiple times to an event', () => {
            const dispatcher = new Dispatcher();
            const mockFunction = jest.fn();
            dispatcher.on( TEST_EVENT_NAME, mockFunction);

            dispatcher.trigger( TEST_EVENT_NAME  );
            dispatcher.trigger( TEST_EVENT_NAME  );

            expect( mockFunction.mock.calls.length ).toBe( 2 );
        } );

        test.skip( 'to subscribe an event with a namespace', () => {
            const dispatcher = new Dispatcher();
            const mockFunction1 = jest.fn();
            const mockFunction2 = jest.fn();

            dispatcher.on( TEST_EVENT_NAME, mockFunction1);
            dispatcher.on( TEST_EVENT_NAME_NS1, mockFunction1);

            dispatcher.trigger( TEST_EVENT_NAME  );

            expect( mockFunction1.mock.calls.length ).toBe( 1 );
            expect( mockFunction2.mock.calls.length ).toBe( 1 );
        } );

        test.skip( 'to subscribe an event with multiple namespaces', () => {
            //TODO
        } );

    } );


    describe( '.one', () => {

        test( 'to subscribe once to an event', () => {
            const dispatcher = new Dispatcher();
            const mockFunction = jest.fn();

            dispatcher.one( TEST_EVENT_NAME, mockFunction);

            dispatcher.trigger( TEST_EVENT_NAME  );
            dispatcher.trigger( TEST_EVENT_NAME  );

            expect( mockFunction.mock.calls.length ).toBe( 1 );
        } );

    } );


    describe( '.off', () => {

        test( 'to unsubscribe an event', () => {
            const dispatcher = new Dispatcher();
            const mockFunction = jest.fn();

            dispatcher.on( TEST_EVENT_NAME, mockFunction);
            dispatcher.trigger( TEST_EVENT_NAME  );

            dispatcher.off( TEST_EVENT_NAME );
            dispatcher.trigger( TEST_EVENT_NAME  );

            expect( mockFunction.mock.calls.length ).toBe( 1 );
        } );

        test.skip( 'to unsubscribe an event with a namespace', () => {
            //TODO
        } );

        test.skip( 'to unsubscribe an event with multiple namespace', () => {
            //TODO
        } );

        test.skip( 'to unsubscribe all events with and without namespaces', () => {
            //TODO
        } );

    } );

} );
