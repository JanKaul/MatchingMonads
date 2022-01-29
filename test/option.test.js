import { expect } from '@esm-bundle/chai';
import { some, none } from "../dist/index"

describe("create option", () => {
    it('', () => {
        const one = some("foo")
        const two = none()

        const three = one.map(x => x.concat("bar"))
        const four = two.map(x => x.concat("bar"))

        expect(three.value).to.equal("foobar")
        expect(four.value).to.equal(undefined)
    })
});