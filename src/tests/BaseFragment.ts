type FragmentConstructor<T extends BaseFragment> = new (container: Element) => T;

export class BaseFragment {
    constructor (public container: Element) {}

    find<T extends BaseFragment>(fragment: FragmentConstructor<T>, selector: string): T | null {
        const element = this.container.querySelector(selector);

        if (!element) return null;

        return new fragment(element);
    }

    get<T extends BaseFragment>(fragment: FragmentConstructor<T>, selector: string): T {
        const element = this.container.querySelector(selector);

        if (!element) throw 'element not found';

        return new fragment(element);
    }
}