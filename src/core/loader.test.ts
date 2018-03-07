import { Component } from './component';
import { Loader } from './loader';
import { defaultDenkstrapOptions } from '../denkstrap';
import conditions from '../conditions/index';


let components: { [key: string]: any };

const importFn = ( path: string ) => {
    return new Promise( ( resolve, reject ) => {
        if ( components.hasOwnProperty( path ) ) {
            resolve( {
                default: components[ path ]
            } );
        } else {
            reject();
        }
    } );
};

Loader.import = importFn;

const consoleError = jest.spyOn( console, 'error' ).mockImplementation( jest.fn() );

beforeEach( () => {
    const testHTML = `
        <div>
            <div data-ds-component="modules/test/component1">
                <div data-ds-component="modules/test/component1.1"></div>
                <div data-ds-component="modules/test/component1.2">
                    <div data-ds-component="modules/test/component1.2.1"></div>            
                </div>
            </div>
            <div data-ds-component="modules/test/component2" data-ds-condition="test"></div>
        </div>
    `;

    document.body.innerHTML = testHTML;

    conditions.test = jest.fn();

    components = {
        'modules/test/component1': class MTC1 extends Component {
        },
        'modules/test/component1.1': class MTC11 extends Component {
        },
        'modules/test/component1.2': class MTC12 extends Component {
        },
        'modules/test/component1.2.1': class MTC121 extends Component {
        },
        'modules/test/component2': class MTC2 extends Component {
        }
    };
} );


describe( 'Loader', () => {

    test( 'to extend the default DenkstrapOptions with the passed options', () => {
        const loader = new Loader( {
            initializedClass: 'bar'
        } );

        // ⚠️ Access private property
        expect( loader.options ).toMatchObject( {
            ...defaultDenkstrapOptions,
            initializedClass: 'bar'
        } );
    } );

    test( 'load the correct amount of components', () => {
        const loaderImportSpy = jest.spyOn( Loader, 'import' );
        const loader = new Loader();

        expect( loaderImportSpy ).toHaveBeenCalledTimes( 4 );

        return loader.promise;
    } );

    test( 'to extend the default condition with the passed conditions', () => {
        const customConditions = {
            test: () => {
            }
        };

        const loader = new Loader( {
            conditions: customConditions
        } );

        // ⚠️ Access private property
        expect( loader.conditions ).toHaveProperty( 'inViewport', conditions.inViewport );
        expect( loader.conditions ).toHaveProperty( 'test', customConditions.test );
    } );

    test( 'to resolve Loader.promise when all not conditionally loaded components have been loaded', () => {
        const loader = new Loader();
        const allComponentsResolvedCallback = jest.fn();

        Promise.all( loader.queries ).then( () => {
            Promise.all( loader.components.map( component => component.$instance.promise ) ).then( () => {
                allComponentsResolvedCallback();
                expect( allComponentsResolvedCallback ).toHaveBeenCalledTimes( 1 );
            } );
        } );

        expect.assertions( 1 );

        return loader.promise;
    } );

    test( 'to add the initializedClass to loaded components', () => {
        const loader = new Loader();

        loader.promise.then( () => {
            expect( document.querySelectorAll( '[data-ds-component].' + loader.options.initializedClass ) ).toHaveLength( 5 );
        } );

        expect.assertions( 1 );

        return loader.promise;
    } );

    test( 'to instantiate components', () => {
        const loader = new Loader();

        loader.promise.then( () => {
            expect( loader.components.filter( component => component.$instance ) ).toHaveLength( 4 );
        } );

        expect.assertions( 1 );

        return loader.promise;
    } );

    test( 'to use a condition if so configured', () => {
        const customConditions = {
            test: jest.fn()
        };

        const loader = new Loader( {
            conditions: customConditions
        } );

        expect( customConditions.test ).toHaveBeenCalledTimes( 1 );

        return loader.promise;
    } );

    test( 'to add queried components to Loader.queries', () => {
        const loader = new Loader();

        expect( loader.queries ).toHaveLength( 4 );

        return loader.promise;
    } );

    test( 'to add all loaded components to Loader.components', () => {
        const loader = new Loader();

        expect( loader.components ).toHaveLength( 4 );

        return loader.promise;
    } );

    test( 'to log an error if a condition is not defined', () => {
        consoleError.mockReset();
        delete conditions.test;
        const loader = new Loader();

        expect( consoleError ).toHaveBeenCalledTimes( 1 );
    } );

    test( 'to log an error if the execution of a condition failed', () => {
        consoleError.mockReset();
        conditions.test = () => {
            throw new Error( 'test condition error' );
        };
        const loader = new Loader();

        expect( consoleError ).toHaveBeenCalledTimes( 1 );
    } );

    test( 'to log an error if dynamic importing a component failed', () => {
        consoleError.mockClear();
        delete components[ 'modules/test/component1' ];
        const loader = new Loader();

        expect.assertions( 1 );

        return new Promise( ( resolve ) => {
            loader.promise.catch( () => {
                expect( consoleError ).toHaveBeenCalledTimes( 2 );
                resolve();
            } );
        } );
    } );

    test( 'to log an error if the initialization of a component failed', () => {
        consoleError.mockClear();
        components[ 'modules/test/component1' ] = class MTC1_new extends Component {
            ready() {
                return new Promise( ( resolve, reject ) => {
                    reject();
                } );
            }
        };

        const loader = new Loader();

        expect.assertions( 1 );

        return loader.promise.then( () => {
            expect( consoleError ).toHaveBeenCalledTimes( 1 );
        } );

    } );

} );
