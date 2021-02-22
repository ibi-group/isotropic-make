import _chai from 'isotropic-dev-dependencies/lib/chai.js';
import _make from '../js/make.js';
import _mocha from 'isotropic-dev-dependencies/lib/mocha.js';

_mocha.describe('make', () => {
    _mocha.it('should make a simple constructor function', () => {
        const prototypeObject = {
                a: 'a',
                b: 'b',
                c: 'c'
            },

            ConstructorFunction = _make(prototypeObject);

        _chai.expect(ConstructorFunction).to.be.a('function');
        _chai.expect(ConstructorFunction).to.have.property('prototype').that.deep.equals(prototypeObject);
        _chai.expect(ConstructorFunction.prototype).to.have.property('constructor', ConstructorFunction);

        {
            const instance = new ConstructorFunction();

            _chai.expect(instance).to.be.an('object');
            _chai.expect(instance).to.be.an.instanceOf(ConstructorFunction);
            _chai.expect(instance).to.have.property('constructor', ConstructorFunction);
            _chai.expect(instance).to.have.property('a', 'a');
            _chai.expect(instance).to.have.property('b', 'b');
            _chai.expect(instance).to.have.property('c', 'c');
        }
    });

    _mocha.it('should make a simple factory function', () => {
        const prototypeObject = {
                a: 'a',
                b: 'b',
                c: 'c'
            },

            factoryFunction = _make(prototypeObject);

        _chai.expect(factoryFunction).to.be.a('function');
        _chai.expect(factoryFunction).to.have.property('prototype').that.deep.equals(prototypeObject);
        _chai.expect(factoryFunction.prototype).to.have.property('constructor', factoryFunction);

        {
            const instance = factoryFunction();

            _chai.expect(instance).to.be.an('object');
            _chai.expect(instance).to.be.an.instanceOf(factoryFunction);
            _chai.expect(instance).to.have.property('constructor', factoryFunction);
            _chai.expect(instance).to.have.property('a', 'a');
            _chai.expect(instance).to.have.property('b', 'b');
            _chai.expect(instance).to.have.property('c', 'c');
        }
    });

    _mocha.it('should call the initialization method', () => {
        let initThis,
            initWasCalled = false;

        const ConstructorFunction = _make({
                _init (...args) {
                    initThis = this;
                    initWasCalled = true;

                    _chai.expect(args).to.deep.equal([
                        'a',
                        'b',
                        'c'
                    ]);

                    [
                        this.a,
                        this.b,
                        this.c
                    ] = args;

                    return this;
                }
            }),
            instance = new ConstructorFunction('a', 'b', 'c');

        _chai.expect(initWasCalled).to.be.true;
        _chai.expect(initThis).to.equal(instance);
        _chai.expect(instance).to.have.property('a', 'a');
        _chai.expect(instance).to.have.property('b', 'b');
        _chai.expect(instance).to.have.property('c', 'c');
    });

    _mocha.it('should call the initialization method with a custom name', () => {
        let initThis,
            initWasCalled = false;

        const ConstructorFunction = _make({
                initializer (...args) {
                    initThis = this;
                    initWasCalled = true;

                    _chai.expect(args).to.deep.equal([
                        'a',
                        'b',
                        'c'
                    ]);

                    [
                        this.a,
                        this.b,
                        this.c
                    ] = args;

                    return this;
                }
            }, 'initializer'),
            instance = new ConstructorFunction('a', 'b', 'c');

        _chai.expect(initWasCalled).to.be.true;
        _chai.expect(initThis).to.equal(instance);
        _chai.expect(instance).to.have.property('a', 'a');
        _chai.expect(instance).to.have.property('b', 'b');
        _chai.expect(instance).to.have.property('c', 'c');
    });

    _mocha.it('should call the custom initialization method', () => {
        let initThis,
            initWasCalled = false;

        const initFunction = function (...args) {
                initThis = this;
                initWasCalled = true;

                _chai.expect(args).to.deep.equal([
                    'a',
                    'b',
                    'c'
                ]);

                [
                    this.a,
                    this.b,
                    this.c
                ] = args;

                return this;
            },

            ConstructorFunction = _make({}, initFunction),
            instance = new ConstructorFunction('a', 'b', 'c');

        _chai.expect(initWasCalled).to.be.true;
        _chai.expect(initThis).to.equal(instance);
        _chai.expect(instance).to.have.property('a', 'a');
        _chai.expect(instance).to.have.property('b', 'b');
        _chai.expect(instance).to.have.property('c', 'c');
    });

    _mocha.it('should mix static properties', () => {
        const ConstructorFunction = _make({}, {
            a: 'a',
            b: 'b',
            c: 'c'
        });

        _chai.expect(ConstructorFunction).to.have.property('a', 'a');
        _chai.expect(ConstructorFunction).to.have.property('b', 'b');
        _chai.expect(ConstructorFunction).to.have.property('c', 'c');
    });

    _mocha.it('should call the static initialization method', () => {
        let staticInitWasCalled,
            staticThis;

        const ConstructorFunction = _make({}, {
            _init (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                _chai.expect(args).to.deep.equal([]);

                return this;
            }
        });

        _chai.expect(staticInitWasCalled).to.be.true;
        _chai.expect(staticThis).to.equal(ConstructorFunction);
    });

    _mocha.it('should call the static initialization method with arguments', () => {
        let staticInitWasCalled,
            staticThis;

        const ConstructorFunction = _make({}, {
            _init (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                _chai.expect(args).to.deep.equal([
                    'x',
                    'y',
                    'z'
                ]);

                [
                    this.x,
                    this.y,
                    this.z
                ] = args;

                return this;
            }
        }, [
            'x',
            'y',
            'z'
        ]);

        _chai.expect(staticInitWasCalled).to.be.true;
        _chai.expect(staticThis).to.equal(ConstructorFunction);
        _chai.expect(ConstructorFunction).to.have.property('x', 'x');
        _chai.expect(ConstructorFunction).to.have.property('y', 'y');
        _chai.expect(ConstructorFunction).to.have.property('z', 'z');
    });

    _mocha.it('should call the static initialization method with arguments when initialization method has a custom name', () => {
        let staticInitWasCalled,
            staticThis;

        const ConstructorFunction = _make({}, {
            _init (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                _chai.expect(args).to.deep.equal([
                    'x',
                    'y',
                    'z'
                ]);

                [
                    this.x,
                    this.y,
                    this.z
                ] = args;

                return this;
            }
        }, '_init', [
            'x',
            'y',
            'z'
        ]);

        _chai.expect(staticInitWasCalled).to.be.true;
        _chai.expect(staticThis).to.equal(ConstructorFunction);
        _chai.expect(ConstructorFunction).to.have.property('x', 'x');
        _chai.expect(ConstructorFunction).to.have.property('y', 'y');
        _chai.expect(ConstructorFunction).to.have.property('z', 'z');
    });

    _mocha.it('should call the static initialization method with a custom name', () => {
        let staticInitWasCalled,
            staticThis;

        const ConstructorFunction = _make({}, {
            staticInitializer (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                _chai.expect(args).to.deep.equal([
                    'x',
                    'y',
                    'z'
                ]);

                [
                    this.x,
                    this.y,
                    this.z
                ] = args;

                return this;
            }
        }, '_init', 'staticInitializer', [
            'x',
            'y',
            'z'
        ]);

        _chai.expect(staticInitWasCalled).to.be.true;
        _chai.expect(staticThis).to.equal(ConstructorFunction);
        _chai.expect(ConstructorFunction).to.have.property('x', 'x');
        _chai.expect(ConstructorFunction).to.have.property('y', 'y');
        _chai.expect(ConstructorFunction).to.have.property('z', 'z');
    });

    _mocha.it('should call the custom static initialization method', () => {
        let staticInitWasCalled,
            staticThis;

        const staticInitFunction = function (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                _chai.expect(args).to.deep.equal([
                    'x',
                    'y',
                    'z'
                ]);

                [
                    this.x,
                    this.y,
                    this.z
                ] = args;

                return this;
            },

            ConstructorFunction = _make({}, '_init', staticInitFunction, [
                'x',
                'y',
                'z'
            ]);

        _chai.expect(staticInitWasCalled).to.be.true;
        _chai.expect(staticThis).to.equal(ConstructorFunction);
        _chai.expect(ConstructorFunction).to.have.property('x', 'x');
        _chai.expect(ConstructorFunction).to.have.property('y', 'y');
        _chai.expect(ConstructorFunction).to.have.property('z', 'z');
    });

    _mocha.it('should extend a prototype chain', () => {
        const ConstructorFunctionA = _make({
                _init (config) {
                    this.a = config.a;
                    return this;
                }
            }),
            ConstructorFunctionB = _make(ConstructorFunctionA, {
                _init (...args) {
                    const [
                        config
                    ] = args;

                    this.b = config.b;
                    return Reflect.apply(ConstructorFunctionB.superclass._init, this, args);
                }
            }),
            ConstructorFunctionC = _make(ConstructorFunctionB, {
                _init (...args) {
                    const [
                        config
                    ] = args;

                    this.c = config.c;
                    return Reflect.apply(ConstructorFunctionC.superclass._init, this, args);
                }
            }),
            instance = new ConstructorFunctionC({
                a: 'a',
                b: 'b',
                c: 'c'
            });

        _chai.expect(ConstructorFunctionC).to.have.property('super_', ConstructorFunctionB);
        _chai.expect(ConstructorFunctionC).to.have.property('superclass', ConstructorFunctionB.prototype);
        _chai.expect(ConstructorFunctionB).to.have.property('super_', ConstructorFunctionA);
        _chai.expect(ConstructorFunctionB).to.have.property('superclass', ConstructorFunctionA.prototype);
        _chai.expect(instance).to.be.instanceOf(ConstructorFunctionC);
        _chai.expect(instance).to.be.instanceOf(ConstructorFunctionB);
        _chai.expect(instance).to.be.instanceOf(ConstructorFunctionA);
        _chai.expect(instance).to.have.property('constructor', ConstructorFunctionC);
        _chai.expect(instance).to.have.property('a', 'a');
        _chai.expect(instance).to.have.property('b', 'b');
        _chai.expect(instance).to.have.property('c', 'c');
    });

    _mocha.it('should extend static properties', () => {
        const ConstructorFunctionA = _make({}, {
                a: 'a',
                b: 'a',
                c: 'a'
            }),
            ConstructorFunctionB = _make(ConstructorFunctionA, {}, {
                b: 'b',
                c: 'b'
            }),
            ConstructorFunctionC = _make(ConstructorFunctionB, {}, {
                c: 'c'
            });

        _chai.expect(ConstructorFunctionC).to.have.property('a', 'a');
        _chai.expect(ConstructorFunctionC).to.have.property('b', 'b');
        _chai.expect(ConstructorFunctionC).to.have.property('c', 'c');
    });

    _mocha.it('should call the inherited initialization method when it hasn\'t been overwritten', () => {
        const ConstructorFunctionA = _make({
                _init () {
                    this._a = 'a';
                    return this;
                }
            }),
            ConstructorFunctionB = _make(ConstructorFunctionA, {
                get a () {
                    return this._a;
                }
            }),
            instance = new ConstructorFunctionB();

        _chai.expect(instance).to.have.property('a', 'a');
    });

    _mocha.it('should call the inherited static initialization method when it hasn\'t been overwritten', () => {
        const ConstructorFunctionA = _make({}, {
                _init () {
                    this._a = 'a';
                    return this;
                }
            }),
            ConstructorFunctionB = _make(ConstructorFunctionA, {}, {
                get a () {
                    return this._a;
                }
            });

        _chai.expect(ConstructorFunctionB).to.have.property('a', 'a');
    });

    _mocha.it('should mix prototypes', () => {
        const ConstructorFunctionA = _make({
                a: 'a',
                b: 'a',
                c: 'a',
                x: 'a',
                y: 'a',
                z: 'a',
                _init (config) {
                    this._a = config.a;
                    return this;
                }
            }),
            ConstructorFunctionB = _make({
                b: 'b',
                c: 'b',
                x: 'b',
                y: 'b',
                z: 'b',
                _init (config) {
                    this._b = config.b;
                    return this;
                }
            }),
            ConstructorFunctionC = _make({
                c: 'c',
                x: 'c',
                y: 'c',
                z: 'c',
                _init (config) {
                    this._c = config.c;
                    return this;
                }
            }),

            ConstructorFunction = _make([
                ConstructorFunctionA,
                ConstructorFunctionB,
                ConstructorFunctionC
            ], {
                x: 'x',
                y: 'y',
                z: 'z',
                _init (...args) {
                    const me = this;

                    ConstructorFunction.mixins.forEach(mixin => {
                        Reflect.apply(mixin.prototype._init, me, args);
                    });

                    return me;
                }
            }),
            instance = new ConstructorFunction({
                a: 'a',
                b: 'b',
                c: 'c'
            });

        _chai.expect(ConstructorFunction).to.have.property('mixins').that.deep.equals([
            ConstructorFunctionA,
            ConstructorFunctionB,
            ConstructorFunctionC
        ]);
        _chai.expect(instance).to.be.instanceOf(ConstructorFunction);
        _chai.expect(instance).to.have.property('constructor', ConstructorFunction);
        _chai.expect(instance).to.have.property('a', 'a');
        _chai.expect(instance).to.have.property('b', 'b');
        _chai.expect(instance).to.have.property('c', 'c');
        _chai.expect(instance).to.have.property('x', 'x');
        _chai.expect(instance).to.have.property('y', 'y');
        _chai.expect(instance).to.have.property('z', 'z');
        _chai.expect(instance).to.have.property('_a', 'a');
        _chai.expect(instance).to.have.property('_b', 'b');
        _chai.expect(instance).to.have.property('_c', 'c');
    });

    _mocha.it('should mix static properties from mixins', () => {
        const ConstructorFunctionA = _make({}, {
                a: 'a',
                b: 'a',
                c: 'a',
                x: 'a',
                y: 'a',
                z: 'a'
            }),
            ConstructorFunctionB = _make({}, {
                b: 'b',
                c: 'b',
                x: 'b',
                y: 'b',
                z: 'b'
            }),
            ConstructorFunctionC = _make({}, {
                c: 'c',
                x: 'c',
                y: 'c',
                z: 'c'
            }),

            ConstructorFunction = _make([
                ConstructorFunctionA,
                ConstructorFunctionB,
                ConstructorFunctionC
            ], {}, {
                x: 'x',
                y: 'y',
                z: 'z'
            });

        _chai.expect(ConstructorFunction).to.have.property('mixins').that.deep.equals([
            ConstructorFunctionA,
            ConstructorFunctionB,
            ConstructorFunctionC
        ]);
        _chai.expect(ConstructorFunction).to.have.property('a', 'a');
        _chai.expect(ConstructorFunction).to.have.property('b', 'b');
        _chai.expect(ConstructorFunction).to.have.property('c', 'c');
        _chai.expect(ConstructorFunction).to.have.property('x', 'x');
        _chai.expect(ConstructorFunction).to.have.property('y', 'y');
        _chai.expect(ConstructorFunction).to.have.property('z', 'z');
    });

    _mocha.it('should call the mixed initialization method when it hasn\'t been overwritten', () => {
        const ConstructorFunctionA = _make({
                _init () {
                    this._a = 'a';
                    return this;
                }
            }),
            ConstructorFunctionB = _make([
                ConstructorFunctionA
            ], {
                get a () {
                    return this._a;
                }
            }),
            instance = new ConstructorFunctionB();

        _chai.expect(instance).to.have.property('a', 'a');
    });

    _mocha.it('should call the mixed static initialization method when it hasn\'t been overwritten', () => {
        const ConstructorFunctionA = _make({}, {
                _init () {
                    this._a = 'a';
                    return this;
                }
            }),
            ConstructorFunctionB = _make([
                ConstructorFunctionA
            ], {}, {
                get a () {
                    return this._a;
                }
            });

        _chai.expect(ConstructorFunctionB).to.have.property('a', 'a');
    });
});
