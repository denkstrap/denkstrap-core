import * as msg from  './message';
import {errorMessages} from './message';
import {ERROR_PAGE} from './message';
import {ErrorCodes} from './message';

describe( 'Messages', () => {

    const env = Object.assign( {}, process.env );

    const consoleWarn = jest.spyOn( console, 'warn' ).mockImplementation( jest.fn() );
    const consoleInfo = jest.spyOn( console, 'info' ).mockImplementation( jest.fn() );

    afterEach( () => {
        process.env = env;
    } );


    test( 'outputs warn without denkstrap hint included', () => {
        process.env.NODE_ENV = 'production';

        msg.warn( msg.ErrorCodes.LoaderDynamicImportFailed, [] );

        let expectFirstMessage = '[' + msg.ErrorCodes.LoaderDynamicImportFailed + '] ' +
        errorMessages[ msg.ErrorCodes.LoaderDynamicImportFailed ];
        expect( consoleWarn ).toBeCalledWith( expectFirstMessage );

    } );

    test( 'outputs info with denkstrap hint included', () => {

        msg.info( msg.ErrorCodes.LoaderDynamicImportFailed, [] );

        expect( consoleInfo ).toBeCalledWith( expect.stringMatching( /denkstrap/ ),
            expect.anything(), expect.anything(), expect.anything(), expect.anything() );


    } );


} );
