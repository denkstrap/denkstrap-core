import { inViewport } from './in-viewport';

export interface ICondition {
    ( load: () => void, element: Element ): void
}

export default {
    inViewport
}
