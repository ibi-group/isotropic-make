import _create from 'isotropic-create';
import _mixin from 'isotropic-mixin';

export default (name, superConstructorFunction, mixinConstructorFunctions, prototypeObject, staticObject, initFunction, staticInitFunction, staticInitFunctionArgs) => {
    if (typeof name !== 'string') {
        staticInitFunctionArgs = staticInitFunction;
        staticInitFunction = initFunction;
        initFunction = staticObject;
        staticObject = prototypeObject;
        prototypeObject = mixinConstructorFunctions;
        mixinConstructorFunctions = superConstructorFunction;
        superConstructorFunction = name;
        name = null;
    }

    if (typeof superConstructorFunction !== 'function') {
        staticInitFunctionArgs = staticInitFunction;
        staticInitFunction = initFunction;
        initFunction = staticObject;
        staticObject = prototypeObject;
        prototypeObject = mixinConstructorFunctions;
        mixinConstructorFunctions = superConstructorFunction;
        superConstructorFunction = Object;
    }

    if (Array.isArray(mixinConstructorFunctions)) {
        if (mixinConstructorFunctions.length === 0) {
            mixinConstructorFunctions = null;
        }
    } else {
        staticInitFunctionArgs = staticInitFunction;
        staticInitFunction = initFunction;
        initFunction = staticObject;
        staticObject = prototypeObject;
        prototypeObject = mixinConstructorFunctions;
        mixinConstructorFunctions = null;
    }

    if (typeof staticObject !== 'object') {
        staticInitFunctionArgs = staticInitFunction;
        staticInitFunction = initFunction;
        initFunction = staticObject;
        staticObject = null;
    }

    if (Array.isArray(initFunction)) {
        staticInitFunctionArgs = initFunction;
        staticInitFunction = '_init';
        initFunction = '_init';
    } else {
        initFunction ||= '_init';

        if (Array.isArray(staticInitFunction)) {
            staticInitFunctionArgs = staticInitFunction;
            staticInitFunction = '_init';
        } else {
            staticInitFunction ||= '_init';
        }
    }

    const superPrototypeObject = superConstructorFunction.prototype,

        inheritedPrototypeObject = Object.create(superPrototypeObject),

        constructorFunction = typeof initFunction === 'function' ?
            function (...args) {
                return Reflect.apply(initFunction, _create(constructorFunction, inheritedPrototypeObject), args);
            } :
            function (...args) {
                const instance = _create(constructorFunction, inheritedPrototypeObject),
                    instanceInitFunction = instance[initFunction];

                return typeof instanceInitFunction === 'function' ?
                    Reflect.apply(instanceInitFunction, instance, args) :
                    instance;
            };

    if (mixinConstructorFunctions) {
        const staticMixinObject = {};

        mixinConstructorFunctions.forEach(mixinConstructorFunction => {
            _mixin(mixinConstructorFunction, staticMixinObject);
            _mixin(mixinConstructorFunction.prototype, inheritedPrototypeObject);
        });

        if (staticObject) {
            _mixin(staticObject, staticMixinObject);
        }

        staticObject = staticMixinObject;
    }

    _mixin(prototypeObject, inheritedPrototypeObject);

    Object.defineProperty(inheritedPrototypeObject, 'constructor', {
        configurable: true,
        enumerable: false,
        value: constructorFunction,
        writable: true
    });

    if (staticObject) {
        _mixin(staticObject, constructorFunction);
    }

    constructorFunction.mixins = mixinConstructorFunctions;
    constructorFunction.prototype = inheritedPrototypeObject;
    constructorFunction.super_ = superConstructorFunction;
    constructorFunction.superclass = superPrototypeObject;

    Reflect.setPrototypeOf(constructorFunction, superConstructorFunction);

    if (name) {
        Object.defineProperty(constructorFunction, 'name', {
            configurable: true,
            value: name
        });
        Object.defineProperty(inheritedPrototypeObject, Symbol.toStringTag, {
            configurable: true,
            value: name
        });
    } else {
        Object.defineProperty(constructorFunction, 'name', {
            configurable: true,
            value: ''
        });
        Reflect.deleteProperty(inheritedPrototypeObject, Symbol.toStringTag);
    }

    if (typeof staticInitFunction === 'string') {
        staticInitFunction = constructorFunction[staticInitFunction];
    }

    if (typeof staticInitFunction === 'function') {
        return Reflect.apply(
            staticInitFunction,
            constructorFunction,
            Array.isArray(staticInitFunctionArgs) ?
                staticInitFunctionArgs :
                []
        );
    }

    return constructorFunction;
};
