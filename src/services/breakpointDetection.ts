import Event from '../utils/event/index';
import { DenkstrapOptions } from '../index.d';
import { BREAKPOINT_CHANGE_EVENT } from '../core/events';

/**
 * Global BreakpointDetection system
 *
 * Events will be fired on the global event-bus and the element specified in the
 * breakpointDetectionSelector.
 *
 * @class BreakpointDetection
 */
export default class BreakpointDetection {

    private options: DenkstrapOptions;
    private currentBreakpoint: string;

    /**
     * The constructor
     *
     * @method ready
     * @param [options] The options
     * @constructs
     */
    constructor( options?: DenkstrapOptions ) {
        this.currentBreakpoint = '';
        this.options = Object.assign( BreakpointDetection.defaults(), options );
        this.currentBreakpoint = this.get();
        this.events();
    }

    /**
     * Returns the default configuration
     *
     * @method defaults
     * @returns {Object} Default Options
     */
    static defaults() {
        return {
            breakpointDetectionSelector: 'body',
            defaultBreakpoint: 'default'
        };
    }

    /**
     * The events method
     *
     * @method events
     */
    events() {

        window.addEventListener( 'resize', () => {
            let breakpoint = this.get();

            if ( this.currentBreakpoint !== breakpoint ) {
                this.currentBreakpoint = breakpoint;
                Event.trigger( BREAKPOINT_CHANGE_EVENT, [ breakpoint ] );

                let breakpointEvent = new CustomEvent(
                    BREAKPOINT_CHANGE_EVENT,
                    {
                        detail: {
                            breakpoint: breakpoint
                        }
                    } ),
                    targets = document.querySelectorAll( this.options.breakpointDetectionSelector );

                for ( let target of targets ) {
                    target.dispatchEvent( breakpointEvent );
                }
            }

        } );
    }

    /**
     * Returns the current breakpoint
     *
     * @method get
     * @returns {String} The current breakpoint
     */
    get(): string {

        let breakpoint = this.options.defaultBreakpoint;
        let element = document.querySelector( this.options.breakpointDetectionSelector );

        if ( element instanceof Element && 'getComputedStyle' in window ) {
            breakpoint = window.getComputedStyle(
                element,
                ':after'
            ).getPropertyValue( 'content' );
            breakpoint = breakpoint.replace( /"/g, '' );
        }

        return breakpoint;
    }
}
