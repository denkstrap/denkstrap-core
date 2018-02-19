import { data } from '../utils/helper/data';
import conditions from '../conditions/index';
import { MessageService, LoaderComponentInitFailed, LoaderDynamicImportFailed, ComponentInitFailed } from '../services/message';
import { defaultDenkstrapOptions } from '../denkstrap';
import { once } from '../utils/helper/once';
import { ComponentContext, Condition, DenkstrapOptions } from '../index.d';


/**
 * Loader
 * @class Loader
 */
export class Loader {

    /**
     * Default configuration
     * @type {DenkstrapOptions}
     */
    private options: DenkstrapOptions;

    /**
     * Array for components
     * @type {Array<DenkstrapOptions>}
     */
    components: ComponentContext[] = [];

    /**
     * Array for queried components
     * @type {Array<Promise>}
     */
    private queries: Array<Promise<any>> = [];

    private messageService: MessageService;

    private promise: Promise<any>;

    /**
     * Loader
     * @constructor
     */
    constructor( options: DenkstrapOptions, messageService?: MessageService ) {

        this.options = Object.assign(
            defaultDenkstrapOptions,
            options
        );

        this.messageService = messageService || new MessageService( this.options );

        this.fetchComponents();

        this.promise = new Promise( ( resolve, reject ) => {
            Promise
                .all( this.queries )
                .then( () => {
                    Promise
                        .all( this.components.map( component => component.$instance.promise ) )
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
        let components: IterableIterator<ComponentContext> = this.componentParser();
        let nextComponent: IteratorResult<ComponentContext>;

        // 🚧 TODO:
        // Maybe with promises instead? On the other hand waiting for the
        // components beeing loaded could cause a slow down of the site.
        do {

            // Get next component
            nextComponent = components.next();

            if ( !nextComponent.done ) {
                // Load next component
                let componentObject = nextComponent.value;

                if (
                    componentObject.$data.condition &&
                    typeof componentObject.$data.condition === 'string'
                ) {
                    try {
                        conditions[ componentObject.$data.condition ].call(
                            this,
                            once( this.loadComponent.bind( this, componentObject ) ),
                            componentObject.$element
                        );
                    } catch ( error ) {
                        console.warn( 'The condition "' + componentObject.$data.condition + '" doesn\'t exist.' );
                    }
                } else {
                    this.loadComponent( componentObject );
                }

                // ⚠️ WARNING ⚠️
                // {@Link: Loader.fetchComponents} runs into an infinite loop if the
                // initializedClass is not set after initializing the component!
                componentObject.$element.classList.add( this.options.initializedClass );
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
    * componentParser( scope: Element = this.options.context, parentComponent?: ComponentContext ): IterableIterator<ComponentContext> {

        let match: Element | null;
        let selector: string = this.options.autoInitSelector
            .map( autoInitSelector => `${autoInitSelector}:not(.${this.options.initializedClass})` )
            .join( ',' );

        do {
            match = scope.querySelector( selector );

            if ( match ) {

                let componentObject: ComponentContext = Loader.getComponentContextObject( match, parentComponent );

                yield componentObject;
                yield* this.componentParser( match, componentObject );

            }

        } while ( match );
    }

    /**
     * Get components informations
     * @param $element Element
     * @param [$parentComponent] Parent Component
     */
    static getComponentContextObject( $element: Element, $parentComponent?: ComponentContext ): ComponentContext {

        let denkstrapDataAttributes: { [key: string]: any } = data( $element, '*', 'ds' );

        return Object.assign(
            {
                $data: denkstrapDataAttributes
            },
            {
                $element,
                $dependencies: [ 'component', 'components' ]
                    .map( content => {
                        let deps: string | null = denkstrapDataAttributes[ content ];
                        return typeof deps === 'string' ?
                            deps.replace( /\s/g, '' ).split( ',' ) :
                            [];
                    } )
                    .reduce( ( a, b ) => {
                        return a.concat( b );
                    } ),
                $parentComponent,
                $children: []
            }
        );
    }

    /**
     * Load component
     * @param componentObject Object with components information {@Link Loader.getComponentContextObject}
     */
    loadComponent( componentObject: ComponentContext ) {

        this.components.push( componentObject );

        // Load dependencies with System.import.
        const loadedDependencies: Promise<any>[] = componentObject.$dependencies.map( component =>
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
     * @param {Array.<*>} components      The component to construct (TODO: Replace with an array/map?)
     * @param {Object}    componentObject The componentObject (TODO: Replace with an array/map?)
     */
    constructComponent( components: Array<any>, componentObject: ComponentContext ) {

        components.forEach( ( Component: any ) => {
            componentObject.$instance = new Component( componentObject, this.messageService );
        } );

    }

}
