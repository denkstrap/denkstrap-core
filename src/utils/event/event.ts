/**
 * Event
 * @class Event
 */
export class Event {

    private type: string;
    private namespace: string[];
    private callback: () => void;
    once: boolean;

    /**
     * Event
     * @param {String} name Event name
     * @param {Array} namespace Event namespaces
     * @param {Function} callback Event callback function
     * @param {Boolean} [once] When 'true' event will be destroyed after the
     *                         first time triggered
     * @constructor
     */
    constructor( name: string, namespace: string[], callback: () => any, once?: boolean ) {
        this.type       = name;
        this.namespace  = namespace;
        this.callback   = callback;
        this.once       = once || false;
    }

    /**
     * Trigger Event
     * @param {Array} namespace Event namespaces
     * @param {Object} context Context will be applied to callback function.
     *                         If undefined the context is the event itself
     * @param {Array} args Arguments will be passed in callback function
     */
    trigger( namespace: string[], context?: any, args?: Array<any> ) {
        if ( !namespace.length || this.hasNamespace( namespace ) ) {
            let eventArgs = [ this ];
            if ( Array.isArray( args ) && args.length > 0 ) {
                args.forEach( arg => {
                    eventArgs.push( arg );
                } );
            }

            this.callback.apply( context || this, eventArgs );
        }
    }

    /**
     * Checks if event has given namespace
     * @param {Array} namespace Namespace to proof
     * @param {String} [subscribedNamespace] Only for function recursion!
     * @returns {boolean} true or false depending if the event has the namespace
     */
    hasNamespace( namespace: string[], subscribedNamespace?: string[] ) : boolean {
        let pNS: string[] = namespace.slice( 0 );
        let sNS: string[] = subscribedNamespace || this.namespace.slice( 0 );

        if ( pNS[ 0 ] === sNS[ 0 ] ) {

            pNS.splice( 0, 1 );
            sNS.splice( 0, 1 );

            if ( pNS.length && sNS.length ) {
                return this.hasNamespace( pNS, sNS );
            } else {
                return ( pNS.length === sNS.length ) || ( sNS.length > pNS.length );
            }
        } else {
            return false;
        }
    }

}
