[![Gitter](https://badges.gitter.im/DemgelOpenSource/Home.svg)](https://gitter.im/DemgelOpenSource/Home?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
# MVC with ExpressJS
I am looking for a good Name for this project... if you feel like offering open an issue.

Simply a wrapper for expressjs. Use of Models/Views/Controllers in a simple to setup environment. Uses Inversify for DI.

## Status

Alpha Status - This project is still young. It is not heavily tested. Use should be to help develope and find bugs and quicks that need to be addressed.

## Examples
### A Controller
``` typescript
import {mvcController, View} from '@demgel/mvc';
import {inject} from 'inversify';

@Controller('example')
export class ExampleController extends mvcController {
    constructor(@inject("SomeService") service: SomeService) {
        super();
    }

    // If no route is set, it will use the function name for the route (some-function)
    @HttpGet()
    someGetFunction() {
        // Do Some stuff
        return new View(this, 'aViewName', {viewparams: "value"});
    }

    // This will make the url be http://example.com/example/post-url/someurlvalue
    @HttpPost({route: 'post-url', parameters: ':someurlvalue'})
    somePostFunction(param: someurlvalue) {
        return JsonResult({object: values});
    }
}
```

Under the hood, inversify is injecting and creating the Controllers as needed. Every call is a seperate isntance, and every controller gets a `Context` that can be used to access the request/response and eventually other important functions.

## Model injection/validation

`@demgel/validation` can inject and validate models into your controller methods

### Model
``` typescript
import {isModel, Model, required} from "@demgel/validation";

@Model()
export class SomeModel extends mvcModel {
    @required()
    value: string;
}
```
The `@Model` decorator will update the `isValid()` function that is inherited from `mvcModel`.
The `@required` decorator will require that `value` has a value when `isValid()` is called, if it isn't it will return false, and the models `errors` property will be filled with a `Map<string, string>` that lists the errors found during validation.

### Usage
``` typescript
import {fromBody, mvcController, Controller} from "@demgel/mvc";

@Controller('/')
export class someController extends mvcController {
    @HttpPost({route: '/route', parameters: '/:someObject')
    someControllerMethod(@fromBody() someObject: SomeModel): Result {
        if (!someObject.isValid()) {
            return new ErrorResult(500, "Model is invalid");
        }
        ...
    }
}
```

## MiddleWare
Middleware can still be used with express, actually you can still use express as before as you are able to access the server directly. But with express-mvc you can use decorators to handle many situations where you required middleware before.

Method and Class decorators

``` typescript
import {getRouter} from "@demgel/mvc;

// Class decorator (notice that only target is required)
export function logger() {
    return target => {
        getRouter().registerClassMiddleware(target, (res, req, next) => {
            console.log("Logging from class middleware");
            next();
        }, Priority.Normal);
    }
}

// Method decorator (notice the target, propertyKey and descriptor)
export function methodLogger() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        getRouter().registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            console.log("Loggin from method middleware");
            next();
        }, Priority.Authorize);
    }
}
```

Using the decorators
``` typescript
import {HttpGet, Controller, logger, methodLogger, mvcController} from "@demgel/mvc";

@Controller("/")
@logger()
export class IndexController extends mvcController {
    @HttpGet()
    @methodLogger()
    aGetFunction(): View {
        return new View(this, "index");
    }
}
```

Everytime the controller is called it will log Logging from class middleware.

While everytime aGetFunction is called it will log Loggin from method middleware, is we made a different method, and didn't add methodLogger, it would not call it for that function, but the logger on the class would still fire.

### Middleware with priority
It is important to make sure the middleware runs when it is supposed too. Authorize should run first, and should error first should a Authorization fail.

### Adding Properties to Context in middleware
Passing values from middleware is easy to handle, anything can be injected into a special `req.context` object that will be made available in the Controllers `context` property.

I use the `extras` on `context` so Typescript doesn't complain to much.
``` typescript
export function middlewareDec() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        getRouter().registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            req.context.extras["somespecialvalue"] = "a special value";
        });
    }
}
```

Thus `somespecialvalue` is added to the context in the controller on the `this.context.extras['somespecialvalue']`.

## Configuration
Currently in these early stages there isn't much to configure directly with express-mvc. There will be options to allow you to set the template engine, etc, but most of this can be set directly on the express engine itself if you so choose.

The current direction is to create fluent functions to set common settings.

``` typescript
server.setFavicon("/some/path/to/favicon.ico")
        .setViewEngine("pug", "../views");

useMongo(...); // This would be a seperate package that can be used to extend express-mvc

server.listen();
```
## Setup

`npm install express-mvc`

Write some controllers

``` typescript
import {expressMvc} from "@demgel/mvc";
import {SomeController, AnotherController} from "./controllers";

// You have to pass the controllers or array of controllers to expressMvc
let server = expressMvc(SomeController, AnotherController);
server.addTransient<SomeService>("SomeService", SomeService);
server.listen(3000);
```

## Special Thanks
@remojansen - for working so hard on inversify

## Using
[![(Inversify](https://raw.githubusercontent.com/inversify/inversify.github.io/master/img/favicon/ms-icon-70x70.png)](http://inversify.io/)
