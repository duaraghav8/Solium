<p align="center">
  <img src="./art/Solium.png">
</p>

<br />

[![Build Status](https://travis-ci.org/duaraghav8/Ethlint.svg?branch=master)](https://travis-ci.org/duaraghav8/Ethlint)
[![Backers on Open Collective](https://opencollective.com/Ethlint/backers/badge.svg)](#backers) 
[![Sponsors on Open Collective](https://opencollective.com/Ethlint/sponsors/badge.svg)](#sponsors) 
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.svg)](https://gitter.im/Solium-linter/Lobby)

Ethlint (Formerly Solium) analyzes your Solidity code for style & security issues and fixes them.

See [Documentation](https://ethlint.readthedocs.io/), [Changelog](./CHANGELOG.md) and [upcoming releases](https://github.com/duaraghav8/Ethlint/projects).

Before beginning to work on a contribution, please read the [Guidelines](./CONTRIBUTING.md).

## Install
```bash
npm install -g ethlint
solium -V
```

For backward-compatibility, you can still use `npm install -g solium`.

If you're currently using the `solium` package for `npm install`, it is highly recommended that you move to `ethlint`. The `solium` package will not receive updates after December, 2019. There are no differences between the updates pushed to `ethlint` and `solium` packages.

## Usage
In the root directory of your DApp:
```bash
solium --init
```

This creates 2 files for you:
- `.soliumignore` - contains names of files and directories to ignore while linting
- `.soliumrc.json` - contains configuration that tells Solium how to lint your project. You should modify this file to configure rules, plugins and sharable configs.

`.soliumrc.json` looks like:

```json
{
  "extends": "solium:recommended",
  "plugins": ["security"],
  "rules": {
    "quotes": ["error", "double"],
    "indentation": ["error", 4],
    "linebreak-style": ["error", "unix"]
  }
}
```

To know which lint rules Solium applies for you, see [Style rules](http://ethlint.readthedocs.io/en/latest/user-guide.html#list-of-style-rules) and [Security rules](https://www.npmjs.com/package/solium-plugin-security#list-of-rules).

---
**NOTE**

Solium does **not** strictly adhere to Solidity [Style Guide](http://solidity.readthedocs.io/en/latest/style-guide.html). It aims to promote coding practices agreed upon by the community at large.

---

### Lint
```bash
solium -f foobar.sol
solium -d contracts/
```

### Configure with comments
**Comment Directives** can be used to configure Solium to ignore specific pieces of code.
They follow the pattern `solium-disable<optional suffix>`.

If you only use the directive, Solium disables all rules for the marked code. If that's not desirable, specify the rules to disable after the directive, separated by comma.

- Disable linting on a specific line
```
contract Foo {
	/* solium-disable-next-line */
	function() {
		bytes32 bar = 'Hello world';	// solium-disable-line quotes

		// solium-disable-next-line security/no-throw, indentation
						throw;
	}
}
```

- Disable linting on entire file

```
/* solium-disable */

contract Foo {
	...
}
```

### Fix
Solium automatically fixes your code to resolve whatever issues it can.
```bash
solium -d contracts/ --fix
```

## Our supporters
<p align="left">
  <a href="https://blog.ethereum.org/2018/03/07/announcing-beneficiaries-ethereum-foundation-grants/">
    <img src="./art/ethereum-logo.png" width="100" alt="Ethereum">
  </a>
  <a href="https://medium.com/@AugurProject/announcing-the-augur-bounty-program-bf11b1e1b7cf">
    <img src="./art/augur.png" width="70" alt="Augur">
  </a>
  &nbsp;&nbsp;
  <a href="https://gitcoin.co/universe?sort=None&direction=-&page=1&q=solium">
    <img src="./art/gitcoin.png" width="80" alt="Gitcoin">
  </a>
</p>

If Ethlint helped make your life simpler, please consider donating ETH to `0xacc661A56af9793a4437876a52F4Ad3fc3C443d6`

#### [IDE and Editor Integrations](http://solium.readthedocs.io/en/latest/user-guide.html#index-9) | [Documentation](https://ethlint.readthedocs.io) | [Demo Video](https://www.youtube.com/watch?v=MlQ6fzwixpI)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/duaraghav8/Ethlint/graphs/contributors"><img src="https://opencollective.com/Ethlint/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/Ethlint#backer)]

<a href="https://opencollective.com/Ethlint#backers" target="_blank"><img src="https://opencollective.com/Ethlint/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/Ethlint#sponsor)]

<a href="https://opencollective.com/Ethlint/sponsor/0/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/1/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/2/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/3/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/4/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/5/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/6/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/7/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/8/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/Ethlint/sponsor/9/website" target="_blank"><img src="https://opencollective.com/Ethlint/sponsor/9/avatar.svg"></a>


