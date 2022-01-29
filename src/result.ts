import { match } from 'ts-pattern';

class BaseResult {
    tag: string
    constructor(tag: string) {
        this.tag = tag
    }
    flatMap<A, B, E>(op: (a: A) => Result<B, E>): Result<B, E> {
        return match(this as unknown as Result<A, E>)
            .with({ tag: "ok" }, (res) => op(res.value))
            .with({ tag: "err" }, (res) => res)
            .exhaustive()
    }
    map<A, B, E>(op: (a: A) => B): Result<B, E> {
        return match(this as unknown as Result<A, E>)
            .with({ tag: "ok" }, (res) => ok<B, E>(op(res.value)))
            .with({ tag: "err" }, (res) => res)
            .exhaustive()
    }
    async asyncMap<A, B, E>(op: (a: A) => B): Promise<Result<B, E>> {
        return await match(this as unknown as Result<A, E>)
            .with({ tag: "ok" }, async (res) => ok<B, E>(await op(res.value)))
            .with({ tag: "err" }, async (res) => res)
            .exhaustive()
    }
    forEach<T, E>(op: (a: T) => void): void {
        match(this as unknown as Result<T, E>)
            .with({ tag: "ok" }, (res) => op(res.value))
            .with({ tag: "err" }, (_) => _)
            .exhaustive()
    }
}

class Ok<T> extends BaseResult {
    tag: "ok"
    value: T
    constructor(val: T) {
        super("ok")
        this.value = val
    }
}

class Err<T> extends BaseResult {
    tag: "err"
    value: T
    constructor(val: T) {
        super("err")
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

