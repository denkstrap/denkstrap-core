import { Denkstrap } from  './denkstrap';

describe( 'Denkstrap Class', () => {

    test( 'exposing to global window', () => {
        const denkstrap = new Denkstrap( { expose: true } );
        expect( ( <any>window ).denkstrap ).toBe( denkstrap );
    } );


} );
