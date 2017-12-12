import { Loader } from './core/loader';
import { MessageService } from './services/message';
import { IDenkstrap, IDenkstrapOptions } from './index.d';
import BreakpointDetection from './services/breakpointDetection';

export const defaultDenkstrapOptions = <IDenkstrapOptions>{
    simpleLogs: false,
    autoInitSelector: [
        '[data-ds-component]',
        '[data-ds-components]'
    ],
    initializedClass: 'js-ds-loaded',
    context: document.body,
    expose: false,
    breakpointDetectionSelector: 'body',
    defaultBreakpoint: 'default'
};

export class Denkstrap implements IDenkstrap {

    options: IDenkstrapOptions;
    messageService: MessageService;
    breakpointDetectionService: BreakpointDetection;
    loader: Loader;

    constructor( customDenkstrapOptions: IDenkstrapOptions ) {

        this.options = Object.assign( {}, defaultDenkstrapOptions, customDenkstrapOptions );
        this.messageService = new MessageService( this.options );
        this.breakpointDetectionService = new BreakpointDetection( this.options );
        this.loader = new Loader( this.options, this.messageService );

        if ( this.options.expose ) {
            (<any>window).denkstrap = this;
        }

    }
}
