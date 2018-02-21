import { ErrorCodes, error } from '../utils/message/message';
import { ComponentContext } from '../index.d';

/**
 * Module
 *
 * Provides build chain functionalities
 *
 * @class Module
 */
export class Component implements ComponentContext {

    $element: Element;
    $components: string[];
    $parentComponent: ComponentContext;
    $children: ComponentContext[];
    $data: {
        options?: {}
    };
    $options: {};

    private promise: Promise<never | any>;

    /**
     * Default build chain
     * @type {Array}
     * @default
     */
    chain(): Array<string> {
        return [ 'ready', 'events' ];
    }

    /**
     * Default settings
     * A Component can provide default settings which will be updated by the data-options
     * when the component will be build
     */
    defaults(): Object {
        return {};
    }

    /**
     * @param {ComponentContext} context Loader ComponentContext
     * @constructs
     */
    constructor( context: ComponentContext ) {
        Object.assign( this, context );

        this.$options = {
            ...this.defaults(),
            ...context.$data.options
        };

        this.registerAsChild( context );

        this.promise = new Promise( ( resolve: () => any, reject: ( err: Error ) => any ) => {
            this.build().then( () => resolve() ).catch( err => reject( err ) );
        } ).catch( err => error( ErrorCodes.ComponentInitFailed, err, context ) );
    }

    /**
     * Executes the build chain
     */
    async build() {
        let chain: string[] = this.chain();
        let lastResult: any;

        for ( let nextMethodName of chain ) {
            let nextMethod: () => any = (<any>this)[ nextMethodName ];
            if ( typeof nextMethod === 'function' ) {
                lastResult = await nextMethod.call( this, lastResult );
            }
        }
    }

    /**
     * Register as child of the given parentComponent
     */
    registerAsChild( self: ComponentContext ) {
        if ( this.$parentComponent ) {
            this.$parentComponent.$children.push( self )
        }
    }

}
