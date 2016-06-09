# MVC with ExpressJS
Simply a wrapper for expressjs. Use of Models/Views/Controllers in a simple to setup environment. Uses Inversify for DI.

This project is not Ready for use in any way... This is still pre-alpha
There are still no Typings for this, using this will be very difficult if even possible yet.

## Examples
### A Controller
``` typescript
import {mvcController, View} from 'express-mvc';
import {inject} from 'inversify';

@Controller({baseName: 'example'})
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
    @HttpPost('post-url')
    somePostFunction(param: someurlvalue) {
        return JsonResult({object: values});
    }
}
```

Under the hood, inversify is injecting and creating the Controllers as needed. Every call is a seperate request, and every controller gets a `Context` that can be used to access the request/response and eventually other important functions.

## MiddleWare
Middleware can still be used with express, actually you can still use express as before as you are able to access the server directly. But with express-mvc you can use decorators to handle many situations where you required middleware before.

Examples to come.

## Configuration
Currently in these early stages there isn't much to configure directly with express-mvc. There will be options to allow you to set the template engine, etc, but most of this can be set directly on the express engine itself if you so choose.

## Setup

`npm install express-mvc`

Write some controllers

``` typescript
import {expressMvc} from "express-mvc";
import {SomeController, AnotherController} from "./controllers";

// You have to pass the controllers or array of controllers to expressMvc
let server = expressMvc(SomeController, AnotherController);
server.addTransient<SomeService>("SomeService", SomeService);
server.start();
```
