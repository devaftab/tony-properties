/// <reference types="react" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace React {
  interface FormEvent<T = Element> {
    preventDefault(): void;
    target: T;
  }
  
  interface ChangeEvent<T = Element> {
    target: T & {
      name: string;
      value: string;
      files?: FileList | null;
    };
  }
}

// Fix implicit any types in state setters
declare function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
declare function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
declare function useEffect(effect: () => void | (() => void), deps?: any[]): void;
