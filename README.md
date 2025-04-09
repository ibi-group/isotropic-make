# isotropic-make

[![npm version](https://img.shields.io/npm/v/isotropic-make.svg)](https://www.npmjs.com/package/isotropic-make)
[![License](https://img.shields.io/npm/l/isotropic-make.svg)](https://github.com/ibi-group/isotropic-make/blob/main/LICENSE)
![](https://img.shields.io/badge/tests-passing-brightgreen.svg)
![](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)

A powerful factory function that creates constructor and factory functions with support for inheritance, mixins, and initialization.

## Why Use This?

- **Flexible Object Creation**: Seamlessly create objects using both constructor and factory patterns
- **Clean Inheritance**: Easily extend and inherit from other objects with clear prototype chains
- **Powerful Mixins**: Support for multiple inheritance through mixin composition
- **Initialization Control**: Customizable initialization methods for both instances and static properties
- **No `new` Keyword Issues**: Works as both a constructor (with `new`) and a factory function (without `new`)

## Installation

```bash
npm install isotropic-make
```

## Usage

```javascript
import _make from 'isotropic-make';

// Create a simple constructor function
const _Person = _make({
    greet () {
        return `Hello, my name is ${this.name}`;
    },
    _init({
        age,
        name
    }) {
        this.age = age;
        this.name = name;

        return this;
    }
});

{
    // Create an instance using constructor pattern
    const john = new _Person({
        age: 30,
        name: 'John'
    });

    console.log(john.greet()); // "Hello, my name is John"
}

{
    // Or using factory pattern (no 'new' keyword)
    const jane = _Person({
        age: 28,
        name: 'Jane'
    });

    console.log(jane.greet()); // "Hello, my name is Jane"
}
```

## Core Concepts

### 1. Constructor/Factory Functions

Functions created by `isotropic-make` work both as constructors (with `new`) and factory functions (without `new`), eliminating issues related to forgetting the `new` keyword.

### 2. Initialization Methods

By default, `isotropic-make` looks for an `_init` method on the prototype to handle instance initialization. You can also provide a custom initialization function or specify a different method name. The `_init` method is optional. If the instance doesn't require any initialization, it doesn't need an `_init` method.

The `_init` method can use the `this` keyword to reference the instance object. The `_init` method should perform any required setup and then return the instance object. Whatever the `_init` method returns is what the constructor function will return. Most `_init` methods should `return this;` but the option is available to return something entirely different. If the `_init` method doesn't return anything, by default it returns `undefined` which is probably not what you want a constructor function to return.

### 3. Static Properties

You can add static properties to your constructor functions, which will be available directly on the function itself.

### 4. Inheritance

`isotropic-make` supports clean prototype inheritance, making it easy to extend existing constructor functions.

Note that a child's `_init` method will replace the parent's `_init` method on the prototype. If the child requires the parent's `_init` method to run, the child's `_init` method needs to explicitly call the parent's `_init` method.

### 5. Mixins

Multiple inheritance is supported through mixins, allowing you to combine behavior from multiple sources.

### 6. Constructor Function Properties

Each constructor function created by `isotropic-make` has several special properties:

- **`mixins`**: An array containing the mixin constructor functions that were used to create this constructor function (or `null` if no mixins were used).
- **`prototype`**: The standard JavaScript prototype object that will be used for instances.
- **`super_`**: A reference to the parent constructor function (similar to Node.js's `util.inherits`).
- **`superclass`**: A reference to the parent constructor's prototype object (similar to YUI's inheritance pattern).

#### When to use these properties

- **`mixins`**: Mainly used for introspection to determine what mixins were incorporated into a constructor function.
- **`prototype`**: Used in the standard JavaScript way for adding or modifying methods and properties that will be shared by all instances.
- **`super_`** and **`superclass`**: Used for calling parent class methods, but with important considerations (see below).

#### Best practices for calling parent methods

When calling a parent method, you have two general approaches:

```javascript
// Approach 1: Direct reference to parent constructor (recommended)
Reflect.apply(ParentClass.prototype.method, this, args);

// Approach 2: Using constructor.superclass reference
Reflect.apply(this.constructor.superclass.method, this, args);
```

**Important note**: The second approach using `this.constructor.superclass` is more dynamic but can lead to unexpected behavior if your class is further extended. This is because `this.constructor` will refer to the most derived class, so `this.constructor.superclass` may not point to the immediate parent you expect. For more predictable behavior, use the direct reference approach when possible.

```javascript
// Example showing why direct references are more reliable
const _Animal = _make({
        makeSound () {
            console.log('Generic animal sound');
        }
    }),
    _Dog = _make(_Animal, {
        makeSound () {
            // Reliable: Directly references parent
            Reflect.apply(_Animal.prototype.makeSound, this, []);
            console.log('Woof!');
        }
    }),
    _Terrier = _make(_Dog, {
        makeSound () {
            // Less reliable: If someone extends Terrier,
            // this.constructor.superclass would point to Terrier, not Dog
            Reflect.apply(this.constructor.superclass.makeSound, this, []);
            console.log('Yap!');
        }
    });
```

## API Overview

```javascript
_make(
    superConstructorFunction,  // Optional: Parent constructor function to inherit from
    mixinConstructorFunctions, // Optional: Array of mixins to incorporate
    prototypeObject,           // Object with prototype methods and properties
    staticObject,              // Optional: Object with static properties
    initFunction,              // Optional: Custom instance initialization function or name
    staticInitFunction,        // Optional: Custom static initialization function or name
    staticInitFunctionArgs     // Optional: Arguments for static initialization
);
```

## Examples

### Basic Constructor with Static Methods

```javascript
import _make from 'isotropic-make';

// Create a Rectangle constructor with instance and static methods
const _Rectangle = _make({
    // prototype methods and properties
    getArea () {
        return this.height * this.width;
    },
    getPerimeter () {
        return 2 * (this.height + this.width);
    },
    _init({
        height,
        width
    }) {
        this.height = height;
        this.width = width;

        return this;
    }
}, {
    // static methods and properties
    fromAreaAndWidth ({
        area,
        width
    }) {
        const height = area / width;

      return _Rectangle({
          height,
          width
      });
    },
    fromSquare ({
        size
    }) {
        return _Rectangle({
            height: size,
            width: size
        });
    }
});

{
    // Create instances
    const rect1 = _Rectangle({
          height: 5,
          width: 10
      }),
      square = Rectangle.fromSquare(6);

    console.log(rect1.getArea()); // 50
    console.log(square.getPerimeter()); // 24
}
```

### Inheritance

```javascript
import _make from 'isotropic-make';

// Base Shape constructor
const _Shape = make({
        get name () {
            return this._name;
        },
        _init ({
            name
        }) {
            this._name = name;

            return this;
        }
    }),

    // Circle inherits from Shape
    _Circle = _make(_Shape, {
        getArea() {
            return Math.PI * this._radius * this._radius;
        },
        getCircumference() {
            return 2 * Math.PI * this._radius;
        },
        get radius () {
            return this._radius;
        },
        _init ({
            radius
        }) {
            // Call parent _init
            Reflect.apply(_Shape.prototype._init, this, [{
                name: 'Circle'
            }]);

            this._radius = radius;

            return this;
        }
    }),
    // Rectangle inherits from Shape
    _Rectangle = _make(_Shape, {
        getArea() {
            return this._height * this._width;
        },
        get height () {
            return this._height;
        },
        get width () {
            return this._width;
        },
        _init({
            height,
            width
        }) {
            // Call parent _init
            Reflect.apply(_Shape.prototype._init, this, [{
                name: 'Rectangle'
            }]);

            this._height = height;
            this._width = width;

            return this;
        }
  });

{
    // Create instances
    const circle = _Circle({
            radius: 5
        }),
        rect = _Rectangle({
            height: 4,
            width: 6
        });

    console.log(circle.name); // "Circle"
    console.log(circle.getArea()); // 78.53981633974483
    console.log(rect.name); // "Rectangle"
    console.log(rect.getArea()); // 24
}
```

### Using Mixins for Multiple Inheritance

```javascript
import _make from 'isotropic-make';

// First mixin constructor
const _Loggable = _make({
        error (message) {
            console.error(`[${this?.name ?? 'Unknown'}] ERROR: ${message}`);
        },
        log (message) {
            console.log(`[${this?.name ?? 'Unknown'}]: ${message}`);
        }
    }),
    // Second mixin constructor
    _Serializable = _make({
        toJSON () {
            const objectToStringify = {};

            // Copy all properties that don't start with underscore
            Object.keys(this).forEach(key => {
                if (!key.startsWith('_')) {
                    objectToStringify[key] = this[key];
                }
            });

            return objectToStringify;
        },
        toString () {
            return JSON.stringify(this.toJSON());
        }
    }),
    // User class that inherits from both through mixins
    _User = _make([
        _Loggable,
        _Serializable
    ], {
        login () {
            this._lastLogin = Date.now();

            this.log('User logged in');

            return this;
        },
        _init({
            email,
            name
        }) {
            this.email = email;
            this.name = name;
            this._lastLoginTime = Date.now();

            this.log('User created');

            return this;
        }
    });

{
    // Create a user
    const john = _User({
        email: 'john@example.com',
        name: 'John'
    });

    // Use methods from both mixins
    john.log('Profile updated'); // [John]: Profile updated
    console.log(john.toString()); // {"email":"john@example.com","name":"John"}
}
```

### Custom Init Functions

Using a custom init method name

```javascript
import _make from 'isotropic-make';

const _Product = _make({
    getPrice () {
        return `$${this.price.toFixed(2)}`;
    },
    initializeMethod ({
        name,
        price
    }) {
        this.name = name;
        this.price = price;

        return this;
    }
}, 'initializeMethod');

{
    const product = _Product({
        name: 'Laptop',
        price: 999.99
    });

    console.log(product.getPrice()); // "$999.99"
}
```

Using a standalone init function

```javascript
import _make from 'isotropic-make';

const _initPerson = function ({
        age,
        name
    }) {
        this.age = age;
        this.name = name;

        return this;
    }
    _Person = _make({
        greet() {
            return `Hello, I'm ${this.name}`;
        }
    }, _initPerson);

{
    const person = _Person({
        age: 30,
        name: 'Alice'
    });

    console.log(person.greet()); // "Hello, I'm Alice"
}
```

### Static Init and Methods

Static init methods are executed before make returns the constructor function.

```javascript
import _make from 'isotropic-make';

const _DatabaseTable = _make({
    query ({
        query
    }) {
        const results = [];

        for (const connection of this.constructor.connections) {
            results.push(`${connection.name}: querying ${this.tableName}: ${query}`);
        }

        return results;
    },
    _init ({
        tableName
    }) {
        this.tableName = tableName;

        return this;
    }
  }, {
    connect(config) {
        this.connections.push(config);
        this.isConnected = true;

        return this;
    },
    disconnect () {
        this.connections = [];
        this.isConnected = false;

        return this;
    },
    _init() {
        this.connections = [];
        this.isConnected = false;

        return this;
    }
});

{
    // Use static methods
    _DatabaseTable.connect({
        host: 'localhost',
        name: 'Example Data',
        user: 'root'
    });

    console.log(_DatabaseTable.isConnected); // true

    // Create instance
    const usersTable = _DatabaseTable('users');

    console.log(userTable.query({
        query: 'SELECT *'
    })); // [ "Example Data: querying users: SELECT *" ]

    _DatabaseTable.disconnect();
    console.log(_DatabaseTable.isConnected); // false
}
```

### Complex Inheritance and Mixins

```javascript
import _make from 'isotropic-make';

// Base component
const _Component = _make({
        render () {
            return `<div id="${this._id}">Generic Component</div>`;
        },
        _init ({
            id = `component-${Date.now()}`,
            type = 'generic'
        } = {}) {
            this._id = id;
            this._type = type;

            return this;
        }
    }),
    // Mixins
    _Draggable = _make({
        enableDrag () {
            this._draggable = true;

            console.log(`Enabled dragging for ${this._id}`);

            return this;
        },
        disableDrag () {
            this._draggable = false;

            console.log(`Disabled dragging for ${this._id}`);

            return this;
        }
    }),
    _Resizable = _make({
        enableResize () {
            this._resizable = true;

            console.log(`Enabled resizing for ${this._id}`);

            return this;
        },
        disableResize () {
            this._resizable = false;

            console.log(`Disabled resizing for ${this._id}`);

            return this;
        }
    }),

    // ButtonComponent inherits from Component
    _ButtonComponent = _make(_Component, {
        render () {
            return `<button id="${this._id}">${this._text}</button>`;
        },
        _init({
            id,
            text = 'Button'
        } = {}) {
            // Call parent _init method
            Reflect.apply(_Component.prototype._init, this, [{
                id,
                type: 'button'
            }]);

            this._text = text;

            return this;
        }
    }),
    // DraggableButtonComponent inherits from ButtonComponent and mixes Draggable
    _DraggableButtonComponent = _make(_ButtonComponent, [
        _Draggable
    ], {
        render () {
            return `<button${
                this._draggable ?
                    ' class="draggable"' :
                    ''
            } id="${this._id}">${this._text}</button>`;
        },
        _init (config) {
            // Call parent _init method
            Reflect.apply(_ButtonComponent.prototype._init, this, [
                config
            ]);

            // Use mixin functionality
            this.enableDrag();

            return this;
        }
    }),
    // InteractivePanelComponent inherits from Component and uses both mixins
    _InteractivePanelComponent = _make(_Component, [
        _Draggable,
        _Resizable
    ], {
        render() {
            const classNames = [];

            if (this._draggable) {
                classNames.push('draggable');
            }

            classNames.push('panel');

            if (this._resizable) {
                classNames.push('resizable');
            }

            return `<div class="${classNames.join(' ')}" id="${this._id}">${this._content}</div>`;
        },
        _init({
            content = '',
            id
        } = {}) {
            // Call parent _init method
            Reflect.apply(_Component.prototype._init, this, [{
                id,
                type: 'interactivePanel'
            }]);

            this._content = content;

            // Use mixin functionality
            this.enableDrag();
            this.enableResize();

            return this;
        }
    });

{
    // Create and use the components
    const button = _ButtonComponent({
            id: 'abcd',
            text: 'Click Me'
        }),
        dragButton = _DraggableButtonComponent({
            id: 'efgh',
            text: 'Drag Me'
        }),
        panel = _InteractivePanelComponent({
            content: '<h3>Interactive Panel</h3>',
            id: 'ijkl'
        });

    console.log(button.render()); // <button id="abcd">Click Me</button>
    console.log(dragButton.render()); // <button class="draggable" id="efgh">Drag Me</button>
    console.log(panel.render()); // <div class="draggable panel resizable" id="ijkl"><h3>Interactive Panel</h3></div>

    panel.disableDrag(); // Disabled dragging for ijkl
    panel.disableResize(); // Disabled resizing for ijkl
    console.log(panel.render()); // <div class="panel" id="ijkl"><h3>Interactive Panel</h3></div>
}
```

### Advanced: Multi-level Inheritance

```javascript
import _make from 'isotropic-make';

// Vehicle base class
const _Vehicle = _make({
        get brand () {
            return this._brand;
        },
        getDescription() {
            return `${this._brand} ${this._model}`;
        },
        get model () {
            return this._model;
        },
        get wheelCount () {
            return this._wheelCount;
        },
        _init ({
            brand,
            model,
            wheelCount
        }) {
            this._brand = brand;
            this._model = model;
            this._wheelCount = wheelCount;

            return this;
        }
    }),

    // Car extends Vehicle
    _Car = _make(_Vehicle, {
        getDescription () {
            return `${Reflect.apply(_Vehicle.prototype.getDescription, this, [])} with ${this._doorCount} doors`;
        },
        get doorCount () {
            return this._doorCount;
        },
        get type () {
            return this._type;
        },
        _init (config) {
            // Call parent _init method
            Reflect.apply(_Vehicle.prototype._init, this, [
                config
            ]);

            this._doorCount = config.doorCount ?? 4;
            this._type = 'car';

            return this;
        }
    }),
    // SportsCar extends Car
    _SportsCar = _make(_Car, {
        getDescription() {
            return `${Reflect.apply(_Car.prototype.getDescription, this, [])} (top speed: ${this._topSpeed} mph)`;
        },
        get topSpeed () {
            return this._topSpeed;
        },
        _init (config) {
            // Call parent _init method
            Reflect.apply(_Car.prototype._init, this, [
                config
            ]);

            this._topSpeed = config.topSpeed ?? 125;
            this._type = 'sports car';

            return this;
        }
    }, {
        categories: [
            'Hypercar',
            'Roadster',
            'Supercar'
        ],
        isFast (car) {
            return car.topSpeed > 155;
        }
    });

{
    // Create instances
    const myCar = _Car({
            brand: 'Toyota',
            doorCount: 4,
            model: 'Corolla',
            wheelCount: 4
        }),
        mySportsCar = _SportsCar({
            brand: 'Ferrari',
            doorCount: 2,
            model: '488',
            topSpeed: 205,
            wheelCount: 4
        });

    console.log(myCar.getDescription()); // "Toyota Corolla with 4 doors"
    console.log(mySportsCar.getDescription()); // "Ferrari 488 with 2 doors (top speed: 205 mph)"
    console.log(_SportsCar.categories); // ["Hypercar", "Roadster", "Supercar"]
    console.log(_SportsCar.isFast(mySportsCar)); // true
}
```

## Comparison with Classes

JavaScript has evolved significantly with the introduction of classes, which provide a more familiar syntax for developers coming from class-based languages. However, `isotropic-make` offers several unique advantages that may make it a better choice for certain applications. Here's a comparison to help you decide which approach best fits your needs:

### Feature Comparison

| Feature | Classes | isotropic-make |
|---------|-------------|----------------|
| Syntax Style | Class-based, familiar to OOP developers | Factory function pattern, functional approach |
| Constructor Enforcement | Requires `new` keyword | Works both with and without `new` |
| Initialization | Constructor method only | Flexible `_init` method or custom initializer |
| Inheritance | Single inheritance with `extends` | Single inheritance plus mixins for multiple inheritance |
| Method Access to Parent | Uses `super` keyword | Direct reference to parent prototype |
| Static Properties | Built-in support with `static` keyword | Supported through separate object parameter |
| Mixins | No built-in support (requires composition) | First-class support for mixins |
| Private Fields | Supported with `#` prefix (newer JS versions) | No support for private fields (intentional, see below) |
| Method Binding | Requires manual binding or arrow functions | Context preserved in prototype methods |
| Memory Efficiency | New instance per object | Shared prototype methods |

### When to Choose Classes

- You prefer a syntax familiar from other object-oriented languages
- You need newer language features like private fields (`#property`)
- You work with frameworks or libraries that are designed around classes
- You want to use TypeScript with built-in class typing

### When to Choose isotropic-make

- You want flexibility between constructor and factory patterns
- You need multiple inheritance through mixins
- You prefer a more functional approach to object creation
- You want more control over the initialization process
- You need to create complex inheritance hierarchies with shared behavior

### Key Advantages of isotropic-make

1. **No `new` Keyword Issues**: You never have to worry about forgetting the `new` keyword, as functions work both as constructors and factories.
2. **Flexible Initialization**: The `_init` pattern gives you more control over initialization than constructors, including returning different types of objects if needed.
3. **Multiple Inheritance**: First-class support for mixins allows for cleaner composition of behaviors from multiple sources.
4. **Static Initialization**: Ability to run initialization code for static properties, not just for instances.
5. **Explicit Prototype References**: The `super_` and `superclass` properties provide clear references to parent constructors and prototypes, enhancing introspection capabilities.
6. **Modular Design**: The approach encourages more composition and modular design compared to deep inheritance hierarchies.

### Potential Trade-offs

1. **Modern Language Features**: Some newer JavaScript features specific to classes may not be directly available.
2. **Familiarity**: Developers more familiar with traditional OOP might have a steeper learning curve.
3. **Ecosystem Integration**: Some frameworks and libraries are designed specifically around classes.
4. **TypeScript Integration**: While workable, TypeScript integration might require more manual type definitions compared to native classes.

### Migration Example

If you're considering migrating from classes to `isotropic-make`, here's a simple conversion example:

```javascript
// Original class
class _Counter {
    constructor ({
        initialValue = 0
    }) {
        this.count = initialValue;
    }
    getValue () {
        return this.count;
    }
    increment () {
        this.count += 1;
        return this;
    }
    static createZero () {
        return new _Counter(0);
    }
}

// Converted to isotropic-make
import _make from 'isotropic-make';

const _Counter = _make({
    getValue() {
        return this.count;
    },
    increment() {
        this.count += 1;
        return this;
    },
    _init({
        initialValue = 0
    }) {
        this.count = initialValue;
        return this;
    }
}, {
    createZero () {
        return _Counter({
            initialValue: 0
        });
    }
});
```

### Conclusion

Both classes and `isotropic-make` have their strengths. Classes offer a familiar, standardized syntax and access to the latest JavaScript features. In contrast, `isotropic-make` provides greater flexibility, more powerful inheritance patterns, and avoids common pitfalls associated with constructor functions.

The choice between them depends on your specific requirements, team preferences, and the nature of your project. For complex object hierarchies, multiple inheritance scenarios, or projects that would benefit from a more functional approach, `isotropic-make` offers compelling advantages over standard classes.

## Design Philosophy: Approachable Encapsulation

`isotropic-make` follows a design philosophy of "approachable encapsulation" rather than strict privacy. While classes now support true private fields using the `#` prefix, `isotropic-make` deliberately uses the underscore (`_`) convention for several important reasons:

### Open for Extension, Closed for Confusion

The `_` prefix indicates "protected" or "internal" members – a signal to other developers that these properties and methods are implementation details not intended for everyday use. However, unlike true private fields, they remain accessible when needed:

```javascript
const _Widget = _make({
    process(input) {
        return this._transform(input);
    },
    // Internal method, but still accessible if needed
    _transform(input) {
        return input.toUpperCase();
    }
});

{
    // Normal usage
    const widget = _Widget();

    widget.process("hello"); // "HELLO"

    // But when necessary, internal methods remain accessible
    widget._transform("direct access"); // "DIRECT ACCESS"
}
```

### Extensibility Without Limitations

One of the primary advantages of this approach is the ability to extend, override, or adapt internal functionality when necessary. This proves invaluable when:

1. **Debugging complex issues** that require inspection of internal state
2. **Extending third-party components** without reimplementing them entirely
3. **Creating specialized subclasses** that need to modify internal behavior
4. **Monkey-patching** in emergency situations

### Real-world Flexibility

In real-world applications, requirements change and edge cases emerge. While a library author can't anticipate every use case, they can provide the flexibility for users to adapt the code to their needs:

```javascript
// A third-party library component with internal methods
const _ThirdPartyComponent = _make({
    render() {
        const data = this._processData();
        return `<div>${data}</div>`;
    },
    _processData() {
        return this.data.join(", ");
    }
});

// Your custom extension that needs special data processing
const _CustomComponent = _make(_ThirdPartyComponent, {
    _processData() {
        // Override the internal method to add custom behavior
        const processed = Reflect.apply(_ThirdPartyComponent.prototype._processData, this, []);

        return processed.toUpperCase();
    }
});
```

### Security Considerations

For situations where true privacy is required for security reasons, `isotropic-make` aligns with the philosophy that secure architectures should separate concerns through proper interface design rather than relying on language-level privacy features:

- Use separate objects or closures to hold truly sensitive data
- Create proxy objects or interfaces when interacting with untrusted code
- Employ proper authentication and authorization at system boundaries

### Convention Over Constraint

By using the underscore convention, `isotropic-make` embraces a philosophy of:

- **Trust between developers** rather than enforcement mechanisms
- **Clear communication** through naming conventions
- **Maximum flexibility** for edge cases and unexpected requirements
- **Pragmatic adaptability** over rigid constraints

This approach acknowledges a fundamental truth of software development: sometimes you need to break the rules, and your tools should allow for that when necessary.

## Contributing

Please refer to [CONTRIBUTING.md](https://github.com/ibi-group/isotropic-make/blob/main/CONTRIBUTING.md) for contribution guidelines.

## Issues

If you encounter any issues, please file them at https://github.com/ibi-group/isotropic-make/issues
