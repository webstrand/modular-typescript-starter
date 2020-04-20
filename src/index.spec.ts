import chai from "chai";
import "mocha";

chai.should();
const { expect } = chai;

import { message } from "./index";

describe("message", function () {
	it("should be named message", function () {
		message.name.should.equal("message");
	});

	it("should return the example message", function () {
		expect(message()).to.equal("Hello World!");
	});
});
