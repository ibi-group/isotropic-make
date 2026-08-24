# isotropic-make Changelog

## 0.14.1 - 2026-08-23

### Changed

- Recommends `node ^26.7.0` / `npm ^11.19.0`.
- `repository` now uses npm's preferred object form with explicit `type` and `url` properties rather than the `github:` shorthand. This is package metadata only.

No runtime behavior changed in this release.

## 0.14.0 - 2026-07-15

### Added

**An optional leading `name` parameter.** `make` now accepts a string as its first argument:

```javascript
const _Person = _make('Person', {
    _init ({
        name
    }) {
        this.name = name;

        return this;
    }
});

_Person.name;                                   // 'Person'
Object.prototype.toString.call(_Person());      // '[object Person]'
```

When a name is supplied, `make` defines `name` on the constructor function and `Symbol.toStringTag` on its prototype. This makes constructors produced by `make` identifiable in stack traces, debugger output, `console.log`, and `Object.prototype.toString`, which previously showed them as anonymous.

The parameter is optional and is detected by type, consistent with how `make` already handles its other optional leading arguments. Every existing call signature continues to work unchanged. If the first argument is not a string, all arguments shift right exactly as before.

### Breaking changes

**An empty `mixins` array is now normalized to `null`.** Calling `make([], {...})` previously left `constructorFunction.mixins` as `[]`; it is now `null`, matching what you get when no mixins argument is passed at all.

If you test for mixins with a truthiness check (`if (Constructor.mixins)`) the result is unchanged in practice, since the empty-array case produced no mixed-in properties either way. If you read `Constructor.mixins.length` without a null guard, that will now throw.

```javascript
// Before
if (Constructor.mixins.length) { /* ... */ }

// After
if (Constructor.mixins?.length) { /* ... */ }
```

**The package now ships source directly instead of a Babel build.** `lib/make.js` is the original, unminified ES module source rather than transpiled and minified output. The source moved from `js/` to `lib/` in the repository, so published code now has readable identifiers and accurate line numbers in stack traces.

#### Migration

No call-site changes are required. If you want named constructors, add a string as the first argument.

Note that when no name is given, `make` now explicitly defines `name` as `''` on the constructor and deletes `Symbol.toStringTag` from the prototype. This preserves the previous observable behavior. The constructor function was already anonymous, because it is assigned from a conditional expression and so never received a name through named evaluation, but it is now explicit rather than incidental.

### Changed

- `description` rewritten and `keywords` expanded for npm discoverability.
- Recommends `node ^26.5.0` / `npm ^11.17.0`.

### Internal

- Test suite migrated from Mocha to the built-in `node --test` runner; assertions still use Chai.
- The Babel toolchain and the `build` / `prepare` build scripts were removed.
- `isotropic-dev-dependencies` updated to `~0.4.0`.
- The separately pinned `eslint` dev dependency was dropped.
- `isotropic-create` and `isotropic-mixin` bumped to `~0.14.0`.

## 0.13.1 - 2025-04-10

### Changed

- A comprehensive README was added, documenting the full argument-shifting signature, inheritance, mixins, and both initialization hooks with examples.
- `eslint` pinned at `~9.8.0` as a direct dev dependency.
- `isotropic-dev-dependencies` bumped to `~0.3.1`.
- `isotropic-create` and `isotropic-mixin` bumped to `~0.13.1`.

No runtime behavior changed in this release.

## 0.13.0 - 2024-07-30

### Breaking changes

**The package is now an ES module.** `"type": "module"` was added to `package.json`. CommonJS consumers can no longer `require('isotropic-make')`.

#### Migration

Switch to `import`:

```javascript
// Before
const _make = require('isotropic-make');

// After
import _make from 'isotropic-make';
```

### Changed

- The default-assignment of `initFunction` and `staticInitFunction` was rewritten to use the logical OR assignment operator (`||=`). Behavior is identical.
- ESLint moved to flat config (`eslint.config.js`) so the `eslintConfig` block was removed from `package.json`.
- Coverage tooling switched from `nyc` to `c8`.
- `repository` given an explicit `github:` prefix.
- Recommends `node ^22.5.1` / `npm ^10.8.2`.

## 0.12.0 - 2021-02-22

### Changed

- The entire dev toolchain was replaced by a single `isotropic-dev-dependencies` dev dependency.
- The Babel, ESLint, and nyc configuration blocks were removed from `package.json` in favor of shared configuration.
- Git hooks are now installed via Husky on `postinstall`.
- Recommends `node ^14.15.5` / `npm ^7.5.4`.

No runtime behavior changed in this release.

## 0.11.0 - 2020-07-27

### Changed

- A `files` allowlist was added so only `lib` is published.
- `.npmignore` was removed.
- Dependency refresh: ESLint 7, Mocha 8, nyc 15, Babel 7.10.
- Lint target raised to ECMAScript 2020.
- Recommends `node ^12.18.3` / `npm ^6.14.6`.

No runtime behavior changed in this release.

## 0.10.0 - 2019-05-10

### Changed

- Added the `isotropic` keyword to `package.json`.
- Dependency bumps.

No runtime behavior changed in this release.

## 0.9.2 - 2019-05-08

### Changed

Dependency bumps only.

## 0.9.1 - 2019-05-08

### Changed

Dependency bumps only.

## 0.9.0 - 2019-05-08

### Changed

- Dev dependency refresh (Babel 7.4, Mocha 6, nyc 14, ESLint 5.16).
- Recommends `node ^10.15.3` / `npm ^6.4.1`.

No runtime behavior changed in this release.

## 0.8.0 - 2019-02-18

### Changed

- Dev dependency refresh.
- Recommends `node ^10.15.1` / `npm ^6.4.1`.

No runtime behavior changed in this release.

## 0.7.0 - 2018-11-25

### Changed

- Migrated from Babel 6 to Babel 7, and from `babel-istanbul` to `nyc` for coverage.
- Dropped the `nsp` security check, which was discontinued in favor of `npm audit`.
- Lint target raised to ECMAScript 2018.
- Recommends `node ^10.13.0` / `npm ^6.4.1`.

No runtime behavior changed in this release.

## 0.6.0 - 2017-09-12

### Breaking changes

**The `babel-runtime` runtime dependency was removed.** Babel's `transform-runtime` plugin was dropped in favor of targeting the running Node.js version directly, so the package no longer pulls `babel-runtime` into your dependency tree. The only remaining runtime dependencies are `isotropic-create` and `isotropic-mixin`.

### Changed

- ESLint configuration moved from `eslint-config-isotropic` to the `plugin:isotropic/isotropic` shared config provided by `eslint-plugin-isotropic`.
- Recommends `node ^8.4.0` / `npm ^5.4.1`.

No runtime behavior changed in this release.

## 0.5.0 - 2017-02-05

### Changed

- Dependency bumps.
- Recommends `node ^6.9.5` / `npm ^4.1.2`.

No runtime behavior changed in this release.

## 0.4.0 - 2017-01-08

### Breaking changes

**Initialization methods named by string are now resolved on the instance at construction time rather than on the prototype object at `make` time.**

Previously, when `initFunction` was a string (including the `'_init'` default), `make` looked it up once, immediately, on the `prototypeObject` literal you passed in:

```javascript
initFunction = prototypeObject[initFunction];
```

That meant an `_init` defined by a superclass or by a mixin was never found, because it was not an own property of the prototype object literal. It also meant assigning `_init` to the prototype after the constructor was made had no effect.

The constructor now performs the lookup on each instance at construction time, so `_init` is resolved through the full prototype chain.

#### Migration

This makes inherited and mixed-in initializers work as expected, which is almost always what you want. But it can change behavior in two situations:

- **A subclass that deliberately did not define `_init` will now inherit and run its superclass's `_init`.** Previously the instance was returned uninitialized. If you relied on that, define an explicit no-op `_init` on the subclass that returns `this`.
- **A mixin that defines `_init` will now be used** where it previously was silently ignored.

**A `constructor` property in `prototypeObject` no longer overrides the generated one.** `make` now defines `constructor` on the prototype *after* mixing in `prototypeObject`, so a `constructor` key in your prototype object is overwritten rather than winning. Previously the property was established before the mixin ran and could be clobbered.

### Changed

- `isotropic-create` and `isotropic-mixin` bumped to `~0.4.0`.
- Recommends `node ^6.9.4` / `npm ^4.1.1`.

## 0.3.0 - 2016-11-27

### Changed

- The deprecated `prepublish` script was replaced by `prepare` (build) and `prepublishOnly` (test and security check), so installing this package as a dependency no longer runs its test suite.
- Source reformatted to comply with updated lint rules. No semantic change.
- Lint target raised to ECMAScript 2017.
- Recommends `node ^6.9.1` / `npm ^4.0.2`.

No runtime behavior changed in this release.

## 0.2.0 - 2016-07-14

### Changed

-`babel-runtime` bumped to `~6.9.1`.
- `isotropic-create` and `isotropic-mixin` bumped to `~0.2.0`.

No runtime behavior changed in this release.

## 0.1.0 - 2016-05-02

Initial release.

- Default export is a factory that builds constructor functions supporting inheritance, mixins, prototype and static members, and initialization hooks.
- Signature is `(superConstructorFunction, mixinConstructorFunctions, prototypeObject, staticObject, initFunction, staticInitFunction, staticInitFunctionArgs)`, where every leading argument is optional and detected by type, so arguments shift right when earlier ones are omitted.
- Constructors work with or without `new`. Calling without `new` returns a properly initialized instance rather than operating on the global object.
- Mixins are applied in array order to both the prototype and a static mixin object, so later entries override earlier ones. Explicit `prototypeObject` and `staticObject` members are applied last and win over mixins.
- Sets `mixins`, `prototype`, `super_`, and `superclass` on the generated constructor, and makes the constructor itself inherit statics from the superconstructor via `Reflect.setPrototypeOf`.
- `initFunction` defaults to `'_init'`. A static initializer can be run at make time via `staticInitFunction` and `staticInitFunctionArgs`. If the static initializer returns a value, that value is returned in place of the constructor.
- Depends on `isotropic-create`, `isotropic-mixin`, and `babel-runtime`.
