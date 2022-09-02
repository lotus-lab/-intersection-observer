/// <reference types="react" />
import { OptionsType } from './types';
export declare const useInViewTrigger: (options?: OptionsType) => {
    visibilityTime?: number | undefined;
    inView: boolean;
    entry?: IntersectionObserverEntry | null | undefined;
    targetRef: import("react").MutableRefObject<any>;
};
