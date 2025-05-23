# apiDoc
apiDoc creates documentation from API descriptions in your source code.

## Important note

For the foreseeable future, ONLY maintaining the project build. Anything beyond general maintenance, currently, falls outside the intended scope.

NPM released under [@cdcabrera/apidoc](https://www.npmjs.com/package/@cdcabrera/apidoc)

> Having options for handling specs is good, especially an easy-to-implement open/free alternative.
>
> The focus of this maintenance will be **dependency updates and NodeJS compatibility on the main `apidoc` package**. May continue refactoring aspects of the codebase and consolidating, but then again no promises.

> ~~This project is currently not active maintained!
See discussion https://github.com/apidoc/apidoc/issues/1436~~

[![validate](https://github.com/cdcabrera/apidoc/actions/workflows/validating.yml/badge.svg)](https://github.com/cdcabrera/apidoc/actions/workflows/validating.yml)
[![License](https://img.shields.io/github/license/cdcabrera/apidoc)](https://github.com/cdcabrera/apidoc/blob/main/LICENSE)

### Documentation: [apidocjs.com](http://apidocjs.com)

### [Live DEMO](http://apidocjs.com/example/)

## Installation

```bash
$ npm install -g @cdcabrera/apidoc
```

## Usage

Add some apidoc comments anywhere in your source code:

```java
/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id User's unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 */
```

Now generate the documentation from `src/` into `doc/`.

```bash
$ apidoc -i src/ -o doc/
```

This repository contains and `example` folder from which you can generate a very complete documentation on an example api endpoint. It also contains best practice hints (in the `footer.md` file).

```bash
$ git clone https://github.com/apidoc/apidoc && cd apidoc
$ npm install --prod
$ ./bin/apidoc -i example -o /tmp/doc
$ $BROWSER /tmp/doc
```

### Programmatic usage

You can generate the documentation programmatically:

```ts
import path from 'path'
import { createDoc } from 'apidoc'

const doc = createDoc({
  src: path.resolve(__dirname, 'src'),
  dest: path.resolve(__dirname, 'doc'), // can be omitted if dryRun is true
  // if you don't want to generate the output files:
  dryRun: true,
  // if you don't want to see any log output:
  silent: true,
})

if (typeof doc !== 'boolean') {
  // Documentation was generated!
  console.log(doc.data) // the parsed api documentation object
  console.log(doc.project) // the project information
}
```

Install type definitions (see [@types/apidoc](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/apidoc/index.d.ts)):

```bash
$ npm install -D @types/apidoc
```

## Container image

You can use apidoc in Podman or Docker.

> We recommend using Podman Desktop these days.
> - https://podman-desktop.io/downloads

### Podman
~~~bash
# first build the image after cloning this repository
podman build -t apidoc/apidoc .
# run it
podman run --rm -v $(pwd):/home/node/apidoc apidoc/apidoc -o YOUR_OUTPUT_DIRECTORY -i YOUR_INPUT_DIRECTORY
~~~
### Docker
~~~bash
# first build the image after cloning this repository
docker build -t apidoc/apidoc .
# run it
docker run --rm -v $(pwd):/home/node/apidoc apidoc/apidoc -o YOUR_OUTPUT_DIRECTORY -i YOUR_INPUT_DIRECTORY
~~~

## Supported programming languages

 * **C#, Go, Dart, Java, JavaScript, PHP, Scala** (all DocStyle capable languages):

   ```javascript
   /**
     * This is a comment.
     */
   ```

 * **Clojure**:

   ```clojure
   ;;;;
   ;; This is a comment.
   ;;;;
   ```

 * **CoffeeScript**:

   ```coffeescript
   ###
   This is a comment.
   ###
   ```

 * **Elixir**:

   ```elixir
   #{
   # This is a comment.
   #}
   ```

 * **Erlang**:

   ```erlang
   %{
   % This is a comment.
   %}
   ```

 * **Perl**

   ```perl
   #**
   # This is a comment.
   #*
   ```

   ```perl
   =pod
   This is a comment.
   =cut
   ```

 * **Python**

   ```python
   """
   This is a comment.
   """
   ```

 * **Ruby**

   ```ruby
   =begin
   This is a comment.
   =end
   ```

## Plugins (extend apiDoc)

apiDoc will auto include installed plugins.

 * [apidoc-plugin-schema](https://github.com/willfarrell/apidoc-plugin-schema) Generates and inject apidoc elements from api schemas. `npm install apidoc-plugin-schema`

For details and an example on how to implement your own plugin, please view [apidoc-plugin-test](https://github.com/apidoc/apidoc-plugin-test).

## Support

Please [create a new issue](https://github.com/apidoc/apidoc/issues/new/choose) if you have a suggestion/question or if you found a problem/bug.

## Contributing

apiDoc is a collaborative project. Pull requests are welcome. Please see the [CONTRIBUTING](./CONTRIBUTING.md) file.

## Build tools

* [flask-apidoc](https://pypi.python.org/pypi/flask-apidoc/) `pip install flask-apidoc`
* [grunt-apidoc](https://github.com/apidoc/grunt-apidoc) `npm install grunt-apidoc`.
* [gapidoc (gulp)](https://github.com/techgaun/gulp-apidoc) `npm install gapidoc`.
* [webpack-apidoc](https://github.com/c0b41/webpack-apidoc) `npm install --save-dev webpack-apidoc`.

## Integration

* [Eclipse Java apiDoc editor templates](https://github.com/skhani/eclipse_java_apiDoc_templates)
* [Eclipse plugin](https://github.com/DWand/eclipse_pdt_apiDoc_editor_templates)
* [Microsoft WebAPI](https://github.com/chehabz/grunt-edge-apidoc-webapi-generator)
* [Sublime Text plugin](https://github.com/DWand/ST3_apiDocAutocompletion)

## Converter

* [apidoc-swagger](https://github.com/fsbahman/apidoc-swagger)
* [apidoc-swagger-3](https://github.com/amanoooo/apidoc-swagger-3)
* [gulp-apidoc-swagger](https://github.com/fsbahman/gulp-apidoc-swagger)
* [Docmaster](https://github.com/bonzzy/docmaster)
* [apidoc-markdown](https://github.com/rigwild/apidoc-markdown)
