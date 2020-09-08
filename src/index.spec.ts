import "mocha";
import chai from "chai";
const { expect } = chai;

import { message } from "./index";

describe("message", function () {
	it("should be named message", function () {
		expect(message.name).to.equal("message");
	});

	it("should return the example message", function () {
		expect(message()).to.equal("Hello World!");
	});
});
