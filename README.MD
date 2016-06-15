[![Gitter](https://badges.gitter.im/DemgelOpenSource/Home.svg)](https://gitter.im/DemgelOpenSource/Home?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
# MVC with ExpressJS
I am looking for a good Name for this project... if you feel like offering open an issue.

Simply a wrapper for expressjs. Use of Models/Views/Controllers in a simple to setup environment. Uses Inversify for DI.

This project is not Ready for use in any way... This is still pre-alpha
There are still no Typings for this, using this will be very difficult if even possible yet.

## Examples
### A Controller
``` typescript
import {mvcController, View} from 'express-mvc';
import {inject} from 'inversify';

@Controller({baseRoute: 'example'})
export class ExampleController extends mvcController {
    constructor(@inject("SomeService") service: SomeService) {
        super();
    }

    // Set true on HttpGet to make essentially an index
    @HttpGet(true)
    someGetFunction() {
        // Do Some stuff
        return new View(this, 'aViewName', {viewparams: "value"});
    }

    // This will make the url be http://example.com/example/post-url/someurlvalue
    @HttpPost({route: 'post-url', parameters: ':/someurlvalue'})
    somePostFunction(param: someurlvalue) {
        return JsonResult({object: values});
    }
}
```

Under the hood, inversify is injecting and creating the Controllers as needed. Every call is a seperate isntance, and every controller gets a `Context` that can be used to access the request/response and eventually other important functions.

## MiddleWare
Middleware can still be used with express, actually you can still use express as before as you are able to access the server directly. But with express-mvc you can use decorators to handle many situations where you required middleware before.

Method and Class decorators

``` typescript
import {RouteBuilder} from "express-mvc";

// Class decorator (notice that only target is required)
export function logger() {
    return target => {
        RouteBuilder.instance.registerClassMiddleware(target, (res, req, next) => {
            console.log("Logging from class middleware");
            next();
        });
    }
}

// Method decorator (notice the target, propertyKey and descriptor)
export function methodLogger() {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        RouteBuilder.instance.registerMethodMiddleware(target, propertyKey, (res, req, next) => {
            console.log("Loggin from method middleware");
            next();
        });
    }
}
```

Using the decorators
``` typescript
import {HttpGet, Controller, logger, methodLogger, mvcController} from "express-mvc";

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
import {expressMvc} from "express-mvc";
import {SomeController, AnotherController} from "./controllers";

// You have to pass the controllers or array of controllers to expressMvc
let server = expressMvc(SomeController, AnotherController);
server.addTransient<SomeService>("SomeService", SomeService);
server.listen(3000);
```
