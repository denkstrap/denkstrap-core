//---------------------------------------------
// MessageCodes
//---------------------------------------------

export enum ErrorCodes {
    // Loader
    LoaderDynamicImportFailed = 'LoaderDynamicImportFailed',
    LoaderComponentInitFailed = 'LoaderComponentInitFailed',

    // Component
    ComponentInitFailed = 'ComponentInitFailed',

    // Condition
    ConditionNotDefined = 'ConditionNotDefined',
    ConditionExecutionFailed = 'ConditionExecutionFailed',

    // Helper
    DataHelperElementNotDefined = 'DataHelperElementNotDefined'
}


//---------------------------------------------
// Messages
//---------------------------------------------

export const messages: { [key: string]: string } = {
    // Loader
    [ErrorCodes.LoaderDynamicImportFailed]: 'Dynamic component import failed',
    [ErrorCodes.LoaderComponentInitFailed]: 'Component initialization failed',

    // Component
    [ErrorCodes.ComponentInitFailed]: 'Error initializing component',

    // Condition
    [ErrorCodes.ConditionNotDefined]: 'Condition is not defined',
    [ErrorCodes.ConditionExecutionFailed]: 'Error executing condition',

    // Helper
    [ErrorCodes.DataHelperElementNotDefined]: 'Element not defined'
};

//---------------------------------------------
// URLs
//---------------------------------------------

// The error explanations URL is referenced in the logs
// MessageCode will be added as #hashtag
export const ERROR_PAGE = 'https://github.com/denkstrap/denkstrap/wiki/Errors#';

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
function logMessage( type: string, code: ErrorCodes, ...data: any[] ) {
    const msgPart1 = `denkstrap ${type}:`;
    const msgPart2 = `[${code}] ${messages[ code ]}`;
    const msgPart3 = `\n${ERROR_PAGE}${code}`;
    const msgPart4 = `\n▶`;
    let msg = [];

    if ( process.env.NODE_ENV === 'production' ) {
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
export function error( code: ErrorCodes, ...data: any[] ) {
    console.error( ...logMessage( 'error', code, ...data ) );
}

/**
 * Logs an denkstrap warning by MessageCode
 * @param {String} code MessageCode
 * @param {*} data Any additional arguments will be added to the log message
 */
export function warn( code: ErrorCodes, ...data: any[] ) {
    console.warn( ...logMessage( 'warning', code, ...data ) );
}

/**
 * Logs an denkstrap warning by MessageCode
 * @param {String} code MessageCode
 * @param {*} data Any additional arguments will be added to the log message
 */
export function info( code: ErrorCodes, ...data: any[] ) {
    console.info( ...logMessage( 'warning', code, ...data ) );
}
