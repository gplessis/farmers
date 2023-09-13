# Mendocino Farmers

During the Endor Labs 2023, we were looking at alternative ways to secure your code

We picked an old but very impacting vulnerability in the Javascript ecosystem:

- [Ars Technica: NPM package with 3 million weekly downloads had a severe vulnerability](https://arstechnica.com/information-technology/2021/09/npm-package-with-3-million-weekly-downloads-had-a-severe-vulnerability/)
- [Proxies are complicated: RCE vulnerability in a 3 million downloads/week NPM package](https://httptoolkit.com/blog/npm-pac-proxy-agent-vulnerability/)

And we decided to adapt EndorCTL to patch your code automatically.

## What is a PAC file?

A PAC file is a "Proxy Auto Configuration" file that you feed your browser with to access URLs, via the `FindProxyForURL` Javascript function:

```javascript
function FindProxyForURL(url, host) { 
  // If the requested website is hosted within the internal network, send direct. 
  if (isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0"))
    return "DIRECT"; 

  // DEFAULT RULE: All other traffic, use below proxies, in fail-over order. 
  return "PROXY 4.5.6.7:8080; PROXY 7.8.9.10:8080";
}
```

## Vulnerability

In this repository, we have a couple of PAC file:

- a well-formatted one
- a malicious one that defines and execute a extra function

These commands will use the well-formatted `proxy.pac` file to route the traffic via the right route (direct or proxy)

```shell
./index.js proxy.pac http://10.0.0.1/
./index.js proxy.pac https://www.google.com/
```

Now we use the malicious `proxy-malicious.pac` file to run the exploit. The extra function in it will "just" dump the current environment:

```sh
./index.js proxy-malicious.pac http://10.0.0.1/
```

Oopsie :)

## How to patch?

### Manually

After cloning this repo and running `npm install`, we use `npm link` to modify the vulnerable library locally

```shell
# We create our collection of patched modules that we can then commit to our repo
mkdir node_modules.patched
cp -a node_modules/degenerator node_modules.patched/

# We patch the local version and make it "linkable" via npm
cd node_modules.patched/degenerator/
patch -p1 < ../../degenerator.patch
npm link

# Then we make npm use our local version
npm link degenerator
```

Now that we have patched the vulnerable library, using the malicious PAC file will just throw a Javascript error instead of executing the malicious code.

### Via EndorCTL

```shell
TBD
```
