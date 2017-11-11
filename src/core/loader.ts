import { data } from '../utils/helper/data';
import { MessageService, LoaderComponentInitFailed, LoaderDynamicImportFailed, ComponentInitFailed } from '../services/message';
import { defaultDenkstrapOptions, IDenkstrapOptions } from '../denkstrap';

/**
 * Component Interface
 */
export interface IComponentContext {
    element: Element;
    options?: Object;
    dependencies: string[];
    parentComponent?: IComponentContext;
    children: IComponentContext[];
    instance?: any
}

/**
 * Loader
 * @class Loader
 */
export class Loader {

    /**
     * Default configuration
     * @type {Object}
     */
    private options: IDenkstrapOptions;

    /**
     * Array for components
     * @type {Array}
     */
    components: IComponentContext[] = [];

    /**
     * Array for components
     * @type {Array}
     */
    private queries: Array<Promise<any>> = [];

    private messageService: MessageService;

    private promise: Promise<any>;

    /**
     * Loader
     * @param {Object}      [options]                  Configuration object
     * @param {String}      [options.autoInitSelector] Selector for denkstrap components
     * @param {String}      [options.initializedClass] Class for initialized components
     * @param {Element} [options.context]          HTML Context
     * @constructor
     */
    constructor( options: IDenkstrapOptions ) {

        this.options = Object.assign(
            defaultDenkstrapOptions,
            options
        );

        this.messageService = new MessageService( {
            simpleLogs: this.options.simpleLogs
        } );

        this.fetchComponents();

        this.promise = new Promise( ( resolve, reject ) => {
            Promise
                .all( this.queries )
                .then( () => {
                    Promise
                        .all( this.components.map( component => component.instance.promise ) )
                        .then( resolve )
                        .catch( err => {
                            this.messageService.error( LoaderComponentInitFailed, err );
                        } );
                } )
                .catch( err => {
                    this.messageService.error( LoaderDynamicImportFailed, err );
                } );
        } );
    }

    /**
     * Fetch all components in defined scope
     */
    fetchComponents() {

        /**
         * componentParser generator instance
         * @type {Generator<Object>}
         */
        let components: IterableIterator<IComponentContext> = this.componentParser();
        let nextComponent: IteratorResult<IComponentContext>;

        // 🚧 TODO:
        // Maybe with promises instead? On the other hand waiting for the
        // components beeing loaded could cause a slow down of the site.
        do {

            // Get next component
            nextComponent = components.next();

            if ( !nextComponent.done ) {
                // Load next component
                // 🚧 TODO:
                // Implement conditions
                this.loadComponent( nextComponent.value );
            }

        } while ( !nextComponent.done );

    }

    /**
     * Generator returns the next unconstructed component
     * ⚠ WARNING ⚠
     * ALWAYS returns the FIRST __unconstructed__ component. If this component doesn't
     * get constructed it will return the same component at the next call.
     * @param     {Element} [scope]           Element scope to search for component
     * @param     {Object}      [parentComponent] Object with the parents {@Link Loader.getComponentContextObject}
     * @generates {Object}                        componentObject Object {@Link Loader.getComponentContextObject}
     */
    * componentParser( scope: Element = this.options.context, parentComponent?: IComponentContext ): IterableIterator<IComponentContext> {

        let match: Element | null;
        let selector: string = this.options.autoInitSelector
            .map( autoInitSelector => `${autoInitSelector}:not(.${this.options.initializedClass})` )
            .join( ',' );

        do {
            match = scope.querySelector( selector );

            if ( match ) {

                let componentObject: IComponentContext = Loader.getComponentContextObject( match, parentComponent );

                yield componentObject;
                yield* this.componentParser( match, componentObject );

            }

        } while ( match );
    }

    /**
     * Get components informations
     * @param {Element} element         Own element
     * @param {Object}      parentComponent Parents component
     * @returns {Object}                    Object with all denkstrap data attributes, element and parent
     */
    static getComponentContextObject( element: Element, parentComponent?: IComponentContext ): IComponentContext {

        let denkstrapDataAttributes: { [key: string]: any } = data( element, '*', 'ds' );

        return Object.assign(
            denkstrapDataAttributes,
            {
                element,
                dependencies: [ 'component', 'components' ]
                    .map( content => {
                        let deps: string | null = denkstrapDataAttributes[ content ];
                        return typeof deps === 'string' ?
                            deps.replace( /\s/g, '' ).split( ',' ) :
                            [];
                    } )
                    .reduce( ( a, b ) => {
                        return a.concat( b );
                    } ),
                parentComponent,
                children: []
            }
        );
    }

    /**
     * Load component
     * @param {Object} componentObject Object with components information {@Link Loader.getComponentContextObject}
     */
    loadComponent( componentObject: IComponentContext ) {

        this.components.push( componentObject );

        // ⚠️ WARNING ⚠️
        // {@Link: Loader.fetchComponents} runs into an infinite loop if the
        // initializedClass is not set after initializing the component!
        componentObject.element.classList.add( this.options.initializedClass );

        // Load dependencies with System.import.
        // @type {Array.<Promise>}
        const loadedDependencies: Promise<any>[] = componentObject.dependencies.map( component =>
            import( `components/${component}` )
        );

        this.queries.push(
            Promise
                .all( loadedDependencies )
                .then(
                    components => this.constructComponent(
                        [ ...components.map( c => c.default ) ],
                        componentObject
                    )
                )
                .catch( err => {
                    this.messageService.error( LoaderDynamicImportFailed , err );
                } )
        );
    }

    /**
     * Construct a component
     * @param {Array.<Class>} components      The component to construct (TODO: Replace with an array/map?)
     * @param {Object}        componentObject The componentObject (TODO: Replace with an array/map?)
     */
    constructComponent( components: Array<any>, componentObject: IComponentContext ) {

        components.forEach( (Component: any) => {
            componentObject.instance = new Component( componentObject, this.messageService );
        } );

    }

}
