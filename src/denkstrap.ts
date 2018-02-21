import { Loader } from './core/loader';
import { DenkstrapOptions } from './index.d';
import BreakpointDetection from './services/breakpointDetection';

export const defaultDenkstrapOptions = <DenkstrapOptions>{
    autoInitSelector: [
        '[data-ds-component]',
        '[data-ds-components]'
    ],
    initializedClass: 'js-ds-loaded',
    context: document.body,
    expose: false,
    breakpointDetectionSelector: 'body',
    defaultBreakpoint: 'default',
    conditions: {}
};

export class Denkstrap  {

    options: DenkstrapOptions;
    breakpointDetection: BreakpointDetection;
    loader: Loader;

    constructor( customDenkstrapOptions: DenkstrapOptions ) {

        this.options = { ...defaultDenkstrapOptions, ...customDenkstrapOptions };
        this.breakpointDetection = new BreakpointDetection( this.options );
        this.loader = new Loader( this.options );

        if ( this.options.expose ) {
            (<any>window).denkstrap = this;
        }

    }
}
