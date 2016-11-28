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
        initFunction = initFunction || '_init';

        if (Array.isArray(staticInitFunction)) {
            staticInitFunctionArgs = staticInitFunction;
            staticInitFunction = '_init';
        } else {
            staticInitFunction = staticInitFunction || '_init';
        }
    }

    if (typeof initFunction === 'string') {
        initFunction = prototypeObject[initFunction];
    }

    /* eslint-disable no-use-before-define */
    const constructorFunction = typeof initFunction === 'function' ?
            function (...args) {
                return Reflect.apply(initFunction, _create(constructorFunction, inheritedPrototypeObject), args);
            } :
            function () {
                return _create(constructorFunction, inheritedPrototypeObject);
            },
        superPrototypeObject = superConstructorFunction.prototype,

        inheritedPrototypeObject = _create(constructorFunction, superPrototypeObject);
    /* eslint-enable no-use-before-define */

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
