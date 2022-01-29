import { match } from 'ts-pattern';

class BaseResult {
    tag: string
    constructor(tag: string) {
        this.tag = tag
    }
    flatMap<A, B, E>(op: (a: A) => Result<B, E>): Result<B, E> {
        return match(this as unknown as Result<A, E>)
            .with({ tag: "some" }, (res) => op(res.value))
            .with({ tag: "none" }, (res) => res)
            .exhaustive()
    }
    map<A, B, E>(op: (a: A) => B): Result<B, E> {
        return match(this as unknown as Result<A, E>)
            .with({ tag: "some" }, (res) => ok<B, E>(op(res.value)))
            .with({ tag: "none" }, (res) => res)
            .exhaustive()
    }
    async asyncMap<A, B, E>(op: (a: A) => B): Promise<Result<B, E>> {
        return await match(this as unknown as Result<A, E>)
            .with({ tag: "some" }, async (res) => ok<B, E>(await op(res.value)))
            .with({ tag: "none" }, async (res) => res)
            .exhaustive()
    }
    forEach<T, E>(op: (a: T) => void): void {
        match(this as unknown as Result<T, E>)
            .with({ tag: "some" }, (res) => op(res.value))
            .with({ tag: "none" }, (_) => _)
            .exhaustive()
    }
}

class Ok<T> extends BaseResult {
    tag: "some"
    value: T
    constructor(val: T) {
        super("some")
        this.value = val
    }
}

class Err<T> extends BaseResult {
    tag: "none"
    value: T
    constructor(val: T) {
        super("none")
        this.value = val
    }
}

export type Result<A, B> = Ok<A> | Err<B>

export function ok<A, B>(arg: A): Result<A, B> {
    return new Ok(arg)
}

export function err<A, B>(arg: B): Result<A, B> {
    return new Err(arg)
}

