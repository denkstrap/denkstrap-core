import { ErrorCodes, error } from '../utils/message/message';
import { ComponentContext } from '../index.d';

/**
 * Module
 *
 * Provides build chain functionalities
 *
 * @class Module
 */
export abstract class Component implements ComponentContext {

    $element: Element;
    $components: string[];
    $parentComponent?: ComponentContext;
    $children: ComponentContext[];
    $data: {
        options?: {}
    };
    $options: {};

    private promise: Promise<never | any>;

    then: Function;

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
        this.$element = context.$element;
        this.$data = context.$data;
        this.$components = context.$components;
        this.$parentComponent = context.$parentComponent;
        this.$children = [];

        this.$options = {
            ...this.defaults(),
            ...context.$data.options
        };

        this.registerAsChild( context );

        this.promise = this.build().catch( err => error( ErrorCodes.ComponentInitFailed, err, context ) );

        this.then = this.promise.then.bind( this.promise );
    }

    /**
     * Executes the build chain
     */
    async build() {
        let chain: string[] = this.chain();
        let lastResult: any;

        for ( let nextMethodName of chain ) {
            let nextMethod: () => any = ( <any> this )[ nextMethodName ];
            if ( typeof nextMethod === 'function' ) {
                lastResult = await nextMethod.call( this, lastResult );
            }
        }
    }

    /**
     * Register as child of the given parentComponent
     */
    private registerAsChild( self: ComponentContext ) {
        if ( this.$parentComponent ) {
            this.$parentComponent.$children.push( self );
        }
    }

}
