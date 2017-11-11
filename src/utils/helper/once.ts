/**
 * The once helper
 *
 * This helper creates a function, which can be called just once
 *
 * @param  {Function}   fn      The function to be wrapped
 * @param  {*}          context The context in which the function should be called
 * @return {Function}           The once wrapper
 */
export function once( fn: (() => any) | null, context: any ) {
    let result: any;

    return function() {
        if ( fn ) {
            result = fn.apply( context, arguments );
            fn = null;
        }

        return result;
    };
}
