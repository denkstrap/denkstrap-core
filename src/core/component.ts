import { ComponentInitFailed, MessageService } from '../services/message';
import { IComponentContext } from '../index.d';

/**
 * Module
 *
 * Provides build chain functionalities
 *
 * @class Module
 */
export class Component implements IComponentContext {

    $element: Element;
    $dependencies: string[];
    $parentComponent: IComponentContext;
    $children: IComponentContext[];
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
     * @param {IComponentContext} context Loader IComponentContext
     * @param {MessageService} messageService
     * @constructs
     */
    constructor( context: IComponentContext, messageService: MessageService ) {
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
    registerAsChild( self: IComponentContext ) {
        if ( this.$parentComponent ) {
            this.$parentComponent.$instance.registerChild( self );
        }
    }

    /**
     * Registers a child
     * @param child
     */
    registerChild( child: IComponentContext ) {
        this.$children.push( child );
        // TODO: some magic, for example livecycle methods?
    }

}
