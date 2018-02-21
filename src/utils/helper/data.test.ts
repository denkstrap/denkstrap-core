import { data } from './data';

const testObject = { bestanden: true };

const testAttributes = {
    t1: 't1',
    json: JSON.stringify( testObject )
};
const testAttributesWithPrefix = {
    'prefix-t1': 't1',
    'prefix-json': JSON.stringify( testObject )
};

const testResultObject = {
    t1: testAttributes.t1,
    json: testObject
};

const testResultObjectWithPrefix = {
    'prefix-t1': testAttributesWithPrefix[ 'prefix-t1' ],
    'prefix-json': testObject
};

const testResultObjectComplete = {
    ...testResultObject,
    ...testResultObjectWithPrefix
};

const testNode = `<div id="TestNode" 
    data-t1="${testAttributes.t1}" 
    data-json='${testAttributes.json}'    
    data-prefix-t1="${testAttributes.t1}"
    data-prefix-json='${testAttributes.json}'
    ></div>`;

document.body.innerHTML = testNode;

const TestNode = document.querySelector( '#TestNode' );


describe( 'data', () => {

    test( 'to get a single data attribute from a node', () => {
        let result = data( TestNode, testAttributes.t1 );
        expect( result[ testAttributes.t1 ] ).toBe( testAttributes.t1 );
    } );

    test( 'to get all data attributes from a node', () => {
        let result = data( TestNode, '*' );
        expect( result ).toMatchObject( testResultObjectComplete );
    } );

    test( 'to get all data attributes from a node if no name is specified', () => {
        let result = data( TestNode );
        expect( result ).toMatchObject( testResultObjectComplete );
    } );

    test( 'to get all to a regex matching data attributes from a node', () => {
        let result = data( TestNode, '*js*' );
        expect( result ).toMatchObject( { json: testObject, 'prefix-json': testObject } );
    } );

    test( 'to get all prefixed data attributes from a node', () => {
        let result = data( TestNode, '*', 'prefix' );
        expect( result ).toMatchObject( testResultObject );
    } );

    test( 'to get all prefixed to a regex matching data attributes from a node', () => {
        let result = data( TestNode, '*js*', 'prefix' );
        expect( result ).toMatchObject( { json: testObject } );
    } );

    test( 'to get a single prefixed data attribute from a node', () => {
        let result = data( TestNode, testAttributes.t1, 'prefix' );
        expect( result[ testAttributes.t1 ] ).toBe( testAttributes.t1 );
    } );

    test( 'to provide all scraped data attributes as a single object', () => {
        let result = data( TestNode, testAttributes.t1, 'prefix' );
        expect( result[ testAttributes.t1 ] ).toBe( testAttributes.t1 );
    } );

    test( 'to remove the prefix from the object property names', () => {
        let result = data( TestNode, '*', 'prefix' );
        expect( result ).toMatchObject( testResultObject );
    } );

    test( 'to parse JSON values', () => {
        let result = data( TestNode, 'json', 'prefix' );
        expect( result ).toMatchObject( {json: testObject} );
    } );

    test( 'to return an empty object when element not exists', () => {
        let result = data( null, '*' );
        expect( result ).toMatchObject( {} );
    } );

    test( 'to return an empty object when attribute not exists', () => {
        let result = data( TestNode, 'does-not-exist' );
        expect( result ).toMatchObject( {} );
    } );

} );
