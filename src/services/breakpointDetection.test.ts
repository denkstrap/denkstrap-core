///<reference path="../../node_modules/@types/node/index.d.ts"/>
/* eslint-disable semi */
import {BreakpointDetection} from './breakpointDetection';
import { defaultDenkstrapOptions } from '../denkstrap';

describe( 'BreakpointDetection', () => {

    test( 'to be tablet on pseudo element content: \'tablet\'', () => {

        // jsdom only supports first argument of getComputedStyle
        //(https://github.com/jsdom/jsdom/issues/1928
        // so we have to mock this function
        let bodyCSSStyleDeclarationObj = window.getComputedStyle( document.body );
        let mockGetComputedStyle = ( element: Element, pseudoElt?: string ) => {
            let mockCSSStyleDeclaration = Object.assign(
                bodyCSSStyleDeclarationObj, {
                    getPropertyValue: ( property: string ): string => {
                        return 'tablet';
                    }
                } );
            return mockCSSStyleDeclaration
        }

        const getComputedStyleCopy = window.getComputedStyle;
        window.getComputedStyle = mockGetComputedStyle;
        let breakpointDetection = new BreakpointDetection();
        // console.log( 2, mockGetComputedStyle( document.body ).getPropertyValue( 'content' ) );
        // console.log( 3, breakpointDetection.get() );
        expect( breakpointDetection.get() ).toBe( 'tablet' );
        window.getComputedStyle = getComputedStyleCopy;

    } );

    test( 'to be default bp on pseudo element content: \'default\'', () => {

        let options = defaultDenkstrapOptions;
        options.breakpointDetectionSelector = '.return-null-selector';
        options.defaultBreakpoint = 'default-bp';
        let breakpointDetection = new BreakpointDetection( options );
        expect( breakpointDetection.get() ).toBe( 'default-bp' );

    } );

    test( 'to do actions on breakpoint change', () => {
        const getComputedStyleCopy = window.getComputedStyle;
        let bodyCSSStyleDeclarationObj = window.getComputedStyle( document.body );
        let mockGetComputedStyle = ( element: Element, pseudoElt?: string ) => {
            let mockCSSStyleDeclaration = Object.assign(
                bodyCSSStyleDeclarationObj, {
                    getPropertyValue: ( property: string ): string => {
                        return 'default-bp';
                    }
                } );
            return mockCSSStyleDeclaration
        }
        window.getComputedStyle = mockGetComputedStyle;

        let breakpointDetection = new BreakpointDetection();

        mockGetComputedStyle = ( element: Element, pseudoElt?: string ) => {
            let mockCSSStyleDeclaration = Object.assign(
                bodyCSSStyleDeclarationObj, {
                    getPropertyValue: ( property: string ): string => {
                        return 'resize-bp';
                    }
                } );
            return mockCSSStyleDeclaration
        }
        window.getComputedStyle = mockGetComputedStyle;

        window.dispatchEvent( new Event( 'resize' ) );

        expect( breakpointDetection.get() ).toBe( 'resize-bp' );

    } );

} );
