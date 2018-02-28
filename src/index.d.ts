// Type definitions for denkstrap-core v3.0.0-alpha.1
// Project: denkstrap
// Definitions by: Matthias Permien

/*~ This is the module template file. You should rename it to index.d.ts
 *~ and place it in a folder with the same name as the module.
 *~ For example, if you were writing a file for "super-greeter", this
 *~ file should be 'super-greeter/index.d.ts'
 */

/*~ If this module is a UMD module that exposes a global variable 'myLib' when
 *~ loaded outside a module loader environment, declare that global here.
 *~ Otherwise, delete this declaration.
 */

export as namespace denkstrap;

export interface CustomDenkstrapOptions {
    autoInitSelector?: string[],
    initializedClass?: string,
    context?: Element,
    expose?: boolean,
    breakpointDetectionSelector?: string,
    defaultBreakpoint?: string,
    conditions?: {
        [key: string]: Condition
    }
}

export interface DenkstrapOptions {
    autoInitSelector: string[],
    initializedClass: string,
    context: Element,
    expose: boolean,
    breakpointDetectionSelector: string,
    defaultBreakpoint: string,
    conditions: {
        [key: string]: Condition
    }
}

export interface ComponentContext {
    $element: Element;
    $data: {
        condition?: string,
        options?: {}
    };
    $components: string[];
    $parentComponent?: ComponentContext;
    $children: ComponentContext[];
    $instance?: any
}

export interface Condition {
    ( load: () => void, element: Element ): void
}
