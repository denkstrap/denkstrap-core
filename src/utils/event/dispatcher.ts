import { Event } from './event';

/**
 * Dispatcher
 * @class Dispatcher
 */
export class Dispatcher {
    private _events: {
        [key: string]: (Event | null)[]
    };

    /**
     * @constructs
     */
    constructor() {
        this._events = {};
    }

    /**
     * Splits event name in name and namespaces
     * @param {String} eventName Name of the event
     * @returns {{name: String, namespace: Array}} splits up the event in name and namespaces
     * @static
     */
    static splitName( eventName: string ): { name: string, namespace: string[] } {
        let namespace = eventName.split( '.' );

        return {
            name: namespace.splice( 0, 1 ).toString(),
            namespace: namespace
        };
    }

    /**
     * Subscribes an Event
     * @param {String} eventName Event name including namespace
     * @param {Function} callback Callback function
     * @param {Boolean} [once] When 'true' event will be destroyed after the first time
     * triggered
     */
    subscribeEvent( eventName: string, callback: () => any, once?: boolean ) {
        let name = Dispatcher.splitName( eventName );
        let target = this._events[ name.name ] ||
            ( this._events[ name.name ] = [] );

        target.push( new Event( name.name, name.namespace, callback, once ) );
    }

    /**
     * Subscribes an Event
     * @param {String} name Event name including namespace
     * @param {Function} callback Callback function
     */
    on( name: string, callback: () => void ) {
        this.subscribeEvent( name, callback );
    }

    /**
     * Subscribes an Event which will be destroyed after first time triggered
     * @param {String} name Event name including namespace
     * @param {Function} callback Callback function
     */
    one( name: string, callback: () => void ) {
        this.subscribeEvent( name, callback, true );
    }

    /**
     * Unsubscribes an event
     * @param {String} eventName Event name including namespace
     */
    off( eventName: string ) {
        let name = Dispatcher.splitName( eventName );
        let events = this._events[ name.name ];

        if ( events === undefined ) {
            return;
        }

        if ( name.namespace.length ) {
            events.forEach( ( event, index ) => {
                if ( event && event.hasNamespace( name.namespace ) ) {
                    events[ index ] = null;
                }
            } );

            events = events.filter( event => {
                return !!event;
            } );

            this._events[ name.name ] = events;
        } else {
            delete this._events[ name.name ];
        }
    }

    /**
     * Triggers an event
     * @param {String} eventName Event name including namespace
     * @param {Array} [args] Arguments wich will be passed in the event callback
     * @param {Object} [context] Context will be applied to event callback
     */
    trigger( eventName: string, args?: any[], context?: any ) {
        let name = Dispatcher.splitName( eventName );
        let events = this._events[ name.name ];

        if ( events === undefined ) {
            return;
        }

        events.forEach( ( event, index ) => {

            if ( event === null ) {
                return;
            }

            event.trigger( name.namespace, context, args );

            if ( event.once ) {
                events[ index ] = null;
            }

        } );

        events = events.filter( event => {
            return !!event;
        } );
    }

}
