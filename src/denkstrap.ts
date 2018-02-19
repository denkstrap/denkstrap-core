import { Loader } from './core/loader';
import { MessageService } from './services/message';
import { DenkstrapOptions } from './index.d';
import BreakpointDetection from './services/breakpointDetection';

export const defaultDenkstrapOptions = <DenkstrapOptions>{
    simpleLogs: false,
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
    messageService: MessageService;
    breakpointDetectionService: BreakpointDetection;
    loader: Loader;

    constructor( customDenkstrapOptions: DenkstrapOptions ) {

        this.options = { ...defaultDenkstrapOptions, ...customDenkstrapOptions };
        this.messageService = new MessageService( this.options );
        this.breakpointDetectionService = new BreakpointDetection( this.options );
        this.loader = new Loader( this.options, this.messageService );

        if ( this.options.expose ) {
            (<any>window).denkstrap = this;
        }

    }
}
