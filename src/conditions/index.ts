import { inViewport } from './in-viewport';

export interface ICondition {
    ( load: () => void, element: Element ): void
}

const conditions: { [key: string] : ICondition } = {
    inViewport
};

export default conditions;
