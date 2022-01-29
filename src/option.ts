import { match } from 'ts-pattern';

class BaseOption {
    tag: string
    constructor(tag: string) {
        this.tag = tag
    }
    flatMap<A, B>(op: (a: A) => Option<B>): Option<B> {
        return match(this as Option<A>)
            .with({ tag: "some" }, (res) => op(res.value))
            .with({ tag: "none" }, (_) => none<B>())
            .exhaustive()
    }
    map<A, B>(op: (a: A) => B): Option<B> {
        return match(this as Option<A>)
            .with({ tag: "some" }, (res) => some(op(res.value)))
            .with({ tag: "none" }, (_) => none<B>())
            .exhaustive()
    }
    async asyncMap<A, B>(op: (a: A) => B): Promise<Option<B>> {
        return await match(this as Option<A>)
            .with({ tag: "some" }, async (res) => some(await op(res.value)))
            .with({ tag: "none" }, async (_) => none<B>())
            .exhaustive()
    }
    forEach<T>(op: (a: T) => void): void {
        match(this as Option<T>)
            .with({ tag: "some" }, (res) => op(res.value))
            .with({ tag: "none" }, (_) => _)
            .exhaustive()
    }
}

class Some<T> extends BaseOption {
    tag: "some"
    value: T
    constructor(val: T) {
        super("some")
        this.value = val
    }
}

class None extends BaseOption {
    tag: "none"
    constructor() {
        super("none")
    }
}

export type Option<T> = Some<T> | None

export function some<T>(arg: T): Option<T> {
    return new Some(arg)
}

export function none<T>(): Option<T> {
    return new None()
}

