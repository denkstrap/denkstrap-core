import { Loader } from './core/loader';

export interface IDenkstrapOptions {
    simpleLogs: boolean,
    autoInitSelector: string[],
    initializedClass: string,
    context: Element
}

export const defaultDenkstrapOptions = <IDenkstrapOptions>{
    simpleLogs: false,
    autoInitSelector: [
        '[data-ds-component]',
        '[data-ds-components]'
    ],
    initializedClass: 'js-ds-loaded',
    context: document.body
};

export class Denkstrap {

    private options: IDenkstrapOptions;
    private loader: Loader;

    constructor( customDenkstrapOptions: IDenkstrapOptions ) {

        this.options = Object.assign( {}, defaultDenkstrapOptions, customDenkstrapOptions );

        this.loader = new Loader( this.options );
    }
}
