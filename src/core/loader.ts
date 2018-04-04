import { data } from '../utils/helper/data';
import conditions from '../conditions/index';
import { ErrorCodes, error } from '../utils/message/message';
import { defaultDenkstrapOptions } from '../denkstrap';
import { once } from '../utils/helper/once';
import { ComponentContext, Condition, CustomDenkstrapOptions, DenkstrapOptions } from '../index.d';


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

    promise: Promise<any>;

    private conditions: {
        [key: string]: Condition
    };

    /**
     * Loader
     * @param {CustomDenkstrapOptions} [options] options
     * @constructor
     */
    constructor( options?: CustomDenkstrapOptions ) {

        this.options = {
            ...defaultDenkstrapOptions,
            ...options
        };

        // TODO: Entscheidung offen:
        // Bekommt jeder Loader ein eigenes Set von Conditions
        // oder Erweitern wir ein allgemeines Set auf das alle
        // Loader zugreifen können
        this.conditions = {
            ...conditions,
            ...this.options.conditions
        };

        this.fetchComponents();

        this.promise = new Promise( ( resolve, reject ) => {
            Promise
                .all( this.queries )
                .then( () => {
                    Promise
                        .all( this.components.map( component => component.$instance.promise ) )
                        .then( resolve )
                        .catch( err => {
                            error( ErrorCodes.LoaderComponentInitFailed, err );
                        } );
                } )
                .catch( err => {
                    error( ErrorCodes.LoaderDynamicImportFailed, err );
                    reject( ErrorCodes.LoaderDynamicImportFailed );
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
                    if ( this.conditions.hasOwnProperty( componentObject.$data.condition ) ) {

                        try {
                            this.conditions[ componentObject.$data.condition ].call(
                                this,
                                once( this.loadComponent.bind( this, componentObject ) ),
                                componentObject.$element
                            );
                        } catch ( err ) {
                            error( ErrorCodes.ConditionExecutionFailed, err, componentObject );
                        }

                    } else {
                        error( ErrorCodes.ConditionNotDefined, componentObject );
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
     */* componentParser( scope: Element = this.options.context,
        parentComponent?: ComponentContext ): IterableIterator<ComponentContext> {

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
     * @param {Element} $element
     * @param {ComponentContext} [$parentComponent] Parent Component
     * @returns {Object}
     */
    static getComponentContextObject( $element: Element, $parentComponent?: ComponentContext ): ComponentContext {

        let denkstrapDataAttributes: { [key: string]: any } = data( $element, '*', 'ds' );

        return Object.assign(
            {
                $data: denkstrapDataAttributes
            },
            {
                $element,
                $components: [ 'component', 'components' ]
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
     * @param {ComponentContext} componentObject Object with components information
     * {@Link Loader.getComponentContextObject}
     */
    loadComponent( componentObject: ComponentContext ) {

        this.components.push( componentObject );

        // Load dependencies with System.import.
        const imports: Promise<any>[] = componentObject.$components.map( component =>
            Loader.import( component )
        );

        this.queries.push(
            Promise
                .all( imports )
                .then(
                    components => this.constructComponent(
                        components.map( c => c.default ),
                        componentObject
                    )
                )
                .catch( err => {
                    error( ErrorCodes.LoaderDynamicImportFailed, err );
                } )
        );
    }

    /**
     * Import function
     * @param {String} path
     * @returns {String}
     */
    static import( path: string ) {
        return import( `components/${path}` );
    }

    /**
     * Construct a component
     * @param {Array.<*>} components      The component to construct (TODO: Replace with an array/map?)
     * @param {Object}    componentObject The componentObject (TODO: Replace with an array/map?)
     */
    constructComponent( components: Array<any>, componentObject: ComponentContext ) {

        components.forEach( ( Component: any ) => {
            componentObject.$instance = new Component( componentObject );
        } );

    }

}
