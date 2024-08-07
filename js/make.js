import _create from 'isotropic-create';
import _mixin from 'isotropic-mixin';

export default (superConstructorFunction, mixinConstructorFunctions, prototypeObject, staticObject, initFunction, staticInitFunction, staticInitFunctionArgs) => {
    if (typeof superConstructorFunction !== 'function') {
        staticInitFunctionArgs = staticInitFunction;
        staticInitFunction = initFunction;
        initFunction = staticObject;
        staticObject = prototypeObject;
        prototypeObject = mixinConstructorFunctions;
        mixinConstructorFunctions = superConstructorFunction;
        superConstructorFunction = Object;
    }

    if (!Array.isArray(mixinConstructorFunctions)) {
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
