/**
 * The data helper
 *
 * Helps to deal with HTML data-Attributes.
 *
 * @param {Element} node     HTMLElement to get the data from
 * @param {String}  [name]     Name from the data attribute. Can contain wildcards.
 * @param {String}  [prefix] Name for a prefix, which will be excluded from the
 *                           keys of the result object
 * @returns {Object}         An object with all prefixed data attributes
 */
export function data( node: Element | null, name = '*', prefix?: string ): { [key: string]: any } {

    if ( node === null ) {
        // TODO: ErrorMessage
        return {};
    }

    let dataAttributes: { [key: string]: {} } = {};

    prefix = 'data-' + ((prefix === undefined) ? '' : (prefix + '-'));
    name = prefix + name;

    Array.prototype
        .filter.call( node.attributes, function( item: Attr ) {
        return new RegExp( '^' + name.split( '*' ).join( '.*' ) + '$' ).test( item.nodeName );
    } )
        .forEach( function( item: Attr ) {
            let value: {} | string;

            if ( item.nodeValue ) {
                try {
                    value = JSON.parse( item.nodeValue );
                } catch ( error ) {
                    value = item.nodeValue;
                }

                dataAttributes[ item.nodeName.split( prefix || '' )[ 1 ] ] = value;
            }
        } );

    return dataAttributes;
}
