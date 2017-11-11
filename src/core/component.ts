import { ComponentInitFailed, MessageService } from '../services/message';
import { IComponentContext } from './loader';

/**
 * Module
 *
 * Provides build chain functionalities
 *
 * @class Module
 */
export class Component {
    private context: IComponentContext;
    private promise: Promise<never | any>;

    /**
     * Default build chain
     * @type {Array}
     * @default
     */
    chain(): Array<string> {
        return [ 'ready', 'events' ];
    };

    /**
     * @param {Object} context Loader IComponentContext
     * @constructs
     */
    constructor( context: IComponentContext, messageService: MessageService ) {
        this.context = context;
        // TODO: Hier scheint es noch eine RaceCondition zu geben
        // this.registerAsChild();
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
    registerAsChild() {
        if ( this.context.parentComponent ) {
            this.context.parentComponent.instance.registerChild( this.context );
        }
    }

    /**
     * Registers a child
     * @param child
     */
    registerChild( child: IComponentContext ) {
        this.context.children.push( child );
        // TODO: some magic, for example livecycle methods?
    }

}
