import { ComponentInitFailed, MessageService } from '../services/message';
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
    $dependencies: string[];
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

    defaults() {
        return {};
    }

    /**
     * @param {ComponentContext} context Loader ComponentContext
     * @param {MessageService} messageService
     * @constructs
     */
    constructor( context: ComponentContext, messageService: MessageService ) {
        Object.assign( this, context );

        this.$options = {
            ...this.defaults(),
            ...context.$data.options
        };

        // TODO: Hier scheint es noch eine RaceCondition zu geben
        // this.registerAsChild( context );

        this.promise = new Promise( ( resolve: () => any, reject: ( err: Error ) => any ) => {
            this.build().then( () => resolve() ).catch( err => reject( err ) );
        } ).catch( err => messageService.error( ComponentInitFailed, err, context ) );
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
            this.$parentComponent.$instance.registerChild( self );
        }
    }

    /**
     * Registers a child
     * @param child
     */
    registerChild( child: ComponentContext ) {
        this.$children.push( child );
        // TODO: some magic, for example livecycle methods?
    }

}
