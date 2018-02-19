//---------------------------------------------
// MessageCodes
//---------------------------------------------

export enum Codes {
    // Loader
    LoaderDynamicImportFailed = 'LoaderDynamicImportFailed',
    LoaderComponentInitFailed = 'LoaderComponentInitFailed',

    // Component
    ComponentInitFailed = 'ComponentInitFailed',

    // Condition
    ConditionNotDefined = 'ConditionNotDefined',
    ConditionExecutionFailed = 'ConditionExecutionFailed'
}


//---------------------------------------------
// Messages
//---------------------------------------------

export const messages: { [key: string]: string } = {
    // Loader
    [Codes.LoaderDynamicImportFailed]: 'Dynamic component import failed',
    [Codes.LoaderComponentInitFailed]: 'Component initialization failed',

    // Component
    [Codes.ComponentInitFailed]: 'Error initializing component',

    // Condition
    [Codes.ConditionNotDefined]: 'Condition is not defined',
    [Codes.ConditionExecutionFailed]: 'Error executing condition'
};

//---------------------------------------------
// URLs
//---------------------------------------------

// The error explanations URL is referenced in the logs
// MessageCode will be added as #hashtag
export const ERROR_PAGE = 'https://github.com/denkstrap/denkstrap/wiki/Errors#';


export class MessageService {

    private options: {
        simpleLogs: boolean
    };

    constructor( { simpleLogs }: { simpleLogs: boolean } ) {
        this.options = {
            simpleLogs
        };
    }

    //---------------------------------------------
    // Error Functions
    //---------------------------------------------

    /**
     * Returns the formatted error message ready to log
     * @param {String} type
     * @param {String} code
     * @param {Array} data
     * @returns {Array}
     */
    logMessage( type: string, code: Codes, ...data: any[] ) {
        const msgPart1 = `denkstrap ${type}:`;
        const msgPart2 = `[${code}] ${messages[ code ]}`;
        const msgPart3 = `\n${ERROR_PAGE}${code}`;
        const msgPart4 = `\n▶`;
        let msg = [];

        if ( this.options.simpleLogs ) {
            msg.push( msgPart2 );
        } else {
            msg.push( msgPart1, msgPart2, msgPart3, msgPart4, ...data );
        }

        return msg;
    }

    /**
     * Logs an denkstrap error by MessageCode
     * @param {String} code MessageCode
     * @param {*} data Any additional arguments will be added to the log message
     */
    error( code: Codes, ...data: any[] ) {
        console.error( ...this.logMessage( 'error', code, ...data ) );
    }

    /**
     * Logs an denkstrap warning by MessageCode
     * @param {String} code MessageCode
     * @param {*} data Any additional arguments will be added to the log message
     */
    warn( code: Codes, ...data: any[] ) {
        console.warn( ...this.logMessage( 'warning', code, ...data ) );
    }

    /**
     * Logs an denkstrap warning by MessageCode
     * @param {String} code MessageCode
     * @param {*} data Any additional arguments will be added to the log message
     */
    info( code: Codes, ...data: any[] ) {
        console.info( ...this.logMessage( 'warning', code, ...data ) );
    }

}
