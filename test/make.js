import {
    describe,
    it
} from 'mocha';

import {
    expect
} from 'chai';

import make from '../js/make.js';

describe('make', () => {
    it('should make a simple constructor function', () => {
        const prototypeObject = {
                a: 'a',
                b: 'b',
                c: 'c'
            },

            ConstructorFunction = make(prototypeObject);

        expect(ConstructorFunction).to.be.a('function');
        expect(ConstructorFunction).to.have.property('prototype').that.deep.equals(prototypeObject);
        expect(ConstructorFunction).to.have.deep.property('prototype.constructor', ConstructorFunction);

        {
            const instance = new ConstructorFunction();

            expect(instance).to.be.an('object');
            expect(instance).to.be.an.instanceOf(ConstructorFunction);
            expect(instance).to.have.property('constructor', ConstructorFunction);
            expect(instance).to.have.property('a', 'a');
            expect(instance).to.have.property('b', 'b');
            expect(instance).to.have.property('c', 'c');
        }
    });

    it('should make a simple factory function', () => {
        const prototypeObject = {
                a: 'a',
                b: 'b',
                c: 'c'
            },

            factoryFunction = make(prototypeObject);

        expect(factoryFunction).to.be.a('function');
        expect(factoryFunction).to.have.property('prototype').that.deep.equals(prototypeObject);
        expect(factoryFunction).to.have.deep.property('prototype.constructor', factoryFunction);

        {
            const instance = factoryFunction();

            expect(instance).to.be.an('object');
            expect(instance).to.be.an.instanceOf(factoryFunction);
            expect(instance).to.have.property('constructor', factoryFunction);
            expect(instance).to.have.property('a', 'a');
            expect(instance).to.have.property('b', 'b');
            expect(instance).to.have.property('c', 'c');
        }
    });

    it('should call the initialization method', () => {
        let initThis,
            initWasCalled = false;

        const ConstructorFunction = make({
                _init (...args) {
                    initThis = this;
                    initWasCalled = true;

                    expect(args).to.deep.equal([
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

        expect(initWasCalled).to.be.true;
        expect(initThis).to.equal(instance);
        expect(instance).to.have.property('a', 'a');
        expect(instance).to.have.property('b', 'b');
        expect(instance).to.have.property('c', 'c');
    });

    it('should call the initialization method with a custom name', () => {
        let initThis,
            initWasCalled = false;

        const ConstructorFunction = make({
                initializer (...args) {
                    initThis = this;
                    initWasCalled = true;

                    expect(args).to.deep.equal([
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

        expect(initWasCalled).to.be.true;
        expect(initThis).to.equal(instance);
        expect(instance).to.have.property('a', 'a');
        expect(instance).to.have.property('b', 'b');
        expect(instance).to.have.property('c', 'c');
    });

    it('should call the custom initialization method', () => {
        let initThis,
            initWasCalled = false;

        const initFunction = function (...args) {
                /* eslint-disable no-invalid-this */
                initThis = this;
                initWasCalled = true;

                expect(args).to.deep.equal([
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
                /* eslint-enable no-invalid-this */
            },

            ConstructorFunction = make({}, initFunction),
            instance = new ConstructorFunction('a', 'b', 'c');

        expect(initWasCalled).to.be.true;
        expect(initThis).to.equal(instance);
        expect(instance).to.have.property('a', 'a');
        expect(instance).to.have.property('b', 'b');
        expect(instance).to.have.property('c', 'c');
    });

    it('should mix static properties', () => {
        const ConstructorFunction = make({}, {
            a: 'a',
            b: 'b',
            c: 'c'
        });

        expect(ConstructorFunction).to.have.property('a', 'a');
        expect(ConstructorFunction).to.have.property('b', 'b');
        expect(ConstructorFunction).to.have.property('c', 'c');
    });

    it('should call the static initialization method', () => {
        let staticInitWasCalled,
            staticThis;

        const ConstructorFunction = make({}, {
            _init (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                expect(args).to.deep.equal([]);

                return this;
            }
        });

        expect(staticInitWasCalled).to.be.true;
        expect(staticThis).to.equal(ConstructorFunction);
    });

    it('should call the static initialization method with arguments', () => {
        let staticInitWasCalled,
            staticThis;

        const ConstructorFunction = make({}, {
            _init (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                expect(args).to.deep.equal([
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

        expect(staticInitWasCalled).to.be.true;
        expect(staticThis).to.equal(ConstructorFunction);
        expect(ConstructorFunction).to.have.property('x', 'x');
        expect(ConstructorFunction).to.have.property('y', 'y');
        expect(ConstructorFunction).to.have.property('z', 'z');
    });

    it('should call the static initialization method with arguments when initialization method has a custom name', () => {
        let staticInitWasCalled,
            staticThis;

        const ConstructorFunction = make({}, {
            _init (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                expect(args).to.deep.equal([
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

        expect(staticInitWasCalled).to.be.true;
        expect(staticThis).to.equal(ConstructorFunction);
        expect(ConstructorFunction).to.have.property('x', 'x');
        expect(ConstructorFunction).to.have.property('y', 'y');
        expect(ConstructorFunction).to.have.property('z', 'z');
    });

    it('should call the static initialization method with a custom name', () => {
        let staticInitWasCalled,
            staticThis;

        const ConstructorFunction = make({}, {
            staticInitializer (...args) {
                staticThis = this;
                staticInitWasCalled = true;

                expect(args).to.deep.equal([
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

        expect(staticInitWasCalled).to.be.true;
        expect(staticThis).to.equal(ConstructorFunction);
        expect(ConstructorFunction).to.have.property('x', 'x');
        expect(ConstructorFunction).to.have.property('y', 'y');
        expect(ConstructorFunction).to.have.property('z', 'z');
    });

    it('should call the custom static initialization method', () => {
        let staticInitWasCalled,
            staticThis;

        const staticInitFunction = function (...args) {
                /* eslint-disable no-invalid-this */
                staticThis = this;
                staticInitWasCalled = true;

                expect(args).to.deep.equal([
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
                /* eslint-enable no-invalid-this */
            },

            ConstructorFunction = make({}, '_init', staticInitFunction, [
                'x',
                'y',
                'z'
            ]);

        expect(staticInitWasCalled).to.be.true;
        expect(staticThis).to.equal(ConstructorFunction);
        expect(ConstructorFunction).to.have.property('x', 'x');
        expect(ConstructorFunction).to.have.property('y', 'y');
        expect(ConstructorFunction).to.have.property('z', 'z');
    });

    it('should extend a prototype chain', () => {
        const ConstructorFunctionA = make({
                _init (config) {
                    this.a = config.a;
                    return this;
                }
            }),
            ConstructorFunctionB = make(ConstructorFunctionA, {
                _init (...args) {
                    const [
                        config
                    ] = args;

                    this.b = config.b;
                    return Reflect.apply(ConstructorFunctionB.superclass._init, this, args);
                }
            }),
            ConstructorFunctionC = make(ConstructorFunctionB, {
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

        expect(ConstructorFunctionC).to.have.property('super_', ConstructorFunctionB);
        expect(ConstructorFunctionC).to.have.property('superclass', ConstructorFunctionB.prototype);
        expect(ConstructorFunctionB).to.have.property('super_', ConstructorFunctionA);
        expect(ConstructorFunctionB).to.have.property('superclass', ConstructorFunctionA.prototype);
        expect(instance).to.be.instanceOf(ConstructorFunctionC);
        expect(instance).to.be.instanceOf(ConstructorFunctionB);
        expect(instance).to.be.instanceOf(ConstructorFunctionA);
        expect(instance).to.have.property('constructor', ConstructorFunctionC);
        expect(instance).to.have.property('a', 'a');
        expect(instance).to.have.property('b', 'b');
        expect(instance).to.have.property('c', 'c');
    });

    it('should extend static properties', () => {
        const ConstructorFunctionA = make({}, {
                a: 'a',
                b: 'a',
                c: 'a'
            }),
            ConstructorFunctionB = make(ConstructorFunctionA, {}, {
                b: 'b',
                c: 'b'
            }),
            ConstructorFunctionC = make(ConstructorFunctionB, {}, {
                c: 'c'
            });

        expect(ConstructorFunctionC).to.have.property('a', 'a');
        expect(ConstructorFunctionC).to.have.property('b', 'b');
        expect(ConstructorFunctionC).to.have.property('c', 'c');
    });

    it('should mix prototypes', () => {
        const ConstructorFunctionA = make({
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
            ConstructorFunctionB = make({
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
            ConstructorFunctionC = make({
                c: 'c',
                x: 'c',
                y: 'c',
                z: 'c',
                _init (config) {
                    this._c = config.c;
                    return this;
                }
            }),

            ConstructorFunction = make([
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

        expect(ConstructorFunction).to.have.property('mixins').that.deep.equals([
            ConstructorFunctionA,
            ConstructorFunctionB,
            ConstructorFunctionC
        ]);
        expect(instance).to.be.instanceOf(ConstructorFunction);
        expect(instance).to.have.property('constructor', ConstructorFunction);
        expect(instance).to.have.property('a', 'a');
        expect(instance).to.have.property('b', 'b');
        expect(instance).to.have.property('c', 'c');
        expect(instance).to.have.property('x', 'x');
        expect(instance).to.have.property('y', 'y');
        expect(instance).to.have.property('z', 'z');
        expect(instance).to.have.property('_a', 'a');
        expect(instance).to.have.property('_b', 'b');
        expect(instance).to.have.property('_c', 'c');
    });

    it('should mix static properties from mixins', () => {
        const ConstructorFunctionA = make({}, {
                a: 'a',
                b: 'a',
                c: 'a',
                x: 'a',
                y: 'a',
                z: 'a'
            }),
            ConstructorFunctionB = make({}, {
                b: 'b',
                c: 'b',
                x: 'b',
                y: 'b',
                z: 'b'
            }),
            ConstructorFunctionC = make({}, {
                c: 'c',
                x: 'c',
                y: 'c',
                z: 'c'
            }),

            ConstructorFunction = make([
                ConstructorFunctionA,
                ConstructorFunctionB,
                ConstructorFunctionC
            ], {}, {
                x: 'x',
                y: 'y',
                z: 'z'
            });

        expect(ConstructorFunction).to.have.property('mixins').that.deep.equals([
            ConstructorFunctionA,
            ConstructorFunctionB,
            ConstructorFunctionC
        ]);
        expect(ConstructorFunction).to.have.property('a', 'a');
        expect(ConstructorFunction).to.have.property('b', 'b');
        expect(ConstructorFunction).to.have.property('c', 'c');
        expect(ConstructorFunction).to.have.property('x', 'x');
        expect(ConstructorFunction).to.have.property('y', 'y');
        expect(ConstructorFunction).to.have.property('z', 'z');
    });
});
