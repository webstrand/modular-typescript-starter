export function message(): string {
	return "Hello World!";
}

if(!("describe" in globalThis)) console.log(message());
