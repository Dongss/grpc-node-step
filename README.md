# grpc-node-step

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Environment](#environment)
- [Dynamic code generate](#dynamic-code-generate)
  - [Step 1: Init files](#step-1-init-files)
  - [Step 2: Specify named services](#step-2-specify-named-services)
  - [Step 3: Server and client](#step-3-server-and-client)
  - [Step 4: Run server and client](#step-4-run-server-and-client)
- [Static code generate](#static-code-generate)
  - [Step 1: Init files](#step-1-init-files-1)
  - [Step 2: Specify named services](#step-2-specify-named-services-1)
  - [Step 3: Compile proto to js file](#step-3-compile-proto-to-js-file)
  - [Step 4: Server and client](#step-4-server-and-client)
  - [Step 5: Run server and client](#step-5-run-server-and-client)
- [Auth with SSL/TLS](#auth-with-ssltls)
  - [Step 1: Init files](#step-1-init-files-2)
  - [Step 2: Generate the certificates](#step-2-generate-the-certificates)
  - [Step 3: Specify named services](#step-3-specify-named-services)
  - [Step 4: Server and client](#step-4-server-and-client-1)
  - [Step 5: Run server and client](#step-5-run-server-and-client-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Environment

* `CentOS7`
* `Node.JS` v8.10.0
* [grpc](https://www.npmjs.com/package/grpc) v1.10.1 (npm)
* [Protocol Buffers](https://github.com/google/protobuf) v3.5.1

## Dynamic code generate

Compile proto file to js dynamic, code is generated at runtime using [Protobuf.js](https://github.com/dcodeIO/ProtoBuf.js/)

### Step 1: Init files

```
npm install grpc --save
```

server file: `./dynamic_codegen/server.js`

client file: `./dynamic_codegen/client.js`

proto file: `./proto/demo/hello.proto`

### Step 2: Specify named services

[./proto/demo/hello.proto](./proto/demo/hello.proto):

```
syntax = "proto3";
package hello;

// The greeting service definition.
service Greeter {
    // Sends a greeting
    rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
    string name = 1;
}

// The response message containing the greetings
message HelloReply {
    string message = 1;
}
```

### Step 3: Server and client

[./dynamic_codegen/server.js](./dynamic_codegen/server.js):

```
const grpc = require('grpc');

const PROTO_PATH = __dirname + '/../proto/demo/hello.proto';
const HelloProto = grpc.load(PROTO_PATH).hello;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
    callback(null, { message: 'Hello ' + call.request.name });
}

const server = new grpc.Server();
server.addService(HelloProto.Greeter.service, {
    sayHello: sayHello
});
server.bind('0.0.0.0:9001', grpc.ServerCredentials.createInsecure());
server.start();
```

[./dynamic_codegen/client.js](./dynamic_codegen/client.js):

```
const grpc = require('grpc');
const path = require('path');

const PROTO_PATH = __dirname + '/../proto/demo/hello.proto';
const HelloProto = grpc.load(PROTO_PATH).hello;

const client = new HelloProto.Greeter('localhost:9001', grpc.credentials.createInsecure());

client.sayHello({ name: 'World'}, function(err, response) {
    console.log('Greeting res:', response.message);
});
```

### Step 4: Run server and client

`node .\dynamic_codegen\server.js`

then

`node .\dynamic_codegen\client.js`

output: 

```
Greeting res: Hello World
```

## Static code generate

Code is pre-generated using protoc and the Node gRPC protoc plugin

### Step 1: Init files

```
npm install grpc google-protobuf --save
npm install grpc-tools --save-dev
```

server file: `./static_codegen/server.js`

client file: `./static_codegen/client.js`

proto file: `./proto/demo/hello.proto`

proto and grpc compiled folder: `./static_codegen/proto_js/`

### Step 2: Specify named services

[./proto/demo/hello.proto](./proto/demo/hello.proto):

```
syntax = "proto3";
package hello;

// The greeting service definition.
service Greeter {
    // Sends a greeting
    rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
    string name = 1;
}

// The response message containing the greetings
message HelloReply {
    string message = 1;
}
```

### Step 3: Compile proto to js file

Compile command:

```
protoc --proto_path=./proto/ --js_out=import_style=commonjs,binary:./static_codegen/proto_js/ --grpc_out=./static_codegen/proto_js/ --plugin=protoc-gen-grpc=node_modules/grpc-tools/bin/grpc_node_plugin proto/demo/hello.proto
```

`./static_codegen/proto_js/` should be:

```
static_codegen/proto_js/
└── demo
    ├── hello_grpc_pb.js
    └── hello_pb.js
```

### Step 4: Server and client

[./static_codegen/server.js](./static_codegen/server.js):

```
const grpc = require('grpc');

const HelloMessage = require('./proto_js/demo/hello_pb');
const HelloService = require('./proto_js/demo/hello_grpc_pb');

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
    let reply = new HelloMessage.HelloReply();

    reply.setMessage( 'Hello ' + call.request.getName() );
    callback(null, reply);
}

const server = new grpc.Server();
server.addService(HelloService.GreeterService, {
    sayHello: sayHello
});
server.bind('0.0.0.0:9001', grpc.ServerCredentials.createInsecure());
server.start();
```

[./static_codegen/client.js](./static_codegen/client.js):

```
const grpc = require('grpc');

const HelloMessage = require('./proto_js/demo/hello_pb');
const HelloService = require('./proto_js/demo/hello_grpc_pb');

const client = new HelloService.GreeterClient('localhost:9001', grpc.credentials.createInsecure());

let request = new HelloMessage.HelloRequest();
request.setName('World');

client.sayHello(request, function(err, response) {
    console.log('Greeting res:', response.getMessage());
});
```

### Step 5: Run server and client

`node .\static_codegen\server.js`

then

`node .\static_codegen\client.js`

output: 

```
Greeting res: Hello World
```

[google-protobuf js doc](https://github.com/google/protobuf/tree/master/js#api) The API is not well-documented yet. :sleeping: Not recommended for now.

## Auth with SSL/TLS

### Step 1: Init files

```
npm install grpc --save
```

server file: `./grpc_auth/server.js`

client file: `./grpc_auth/client.js`

proto file: `./proto/demo/hello.proto`

certificates: `./keys/`

### Step 2: Generate the certificates

Generate the certificates:

```
openssl genrsa -passout pass:1111 -des3 -out ca.key 4096
openssl req -passin pass:1111 -new -x509 -days 365 -key ca.key -out ca.crt -subj  "/C=FR/ST=Paris/L=Paris/O=Test/OU=Test/CN=ca"
openssl genrsa -passout pass:1111 -des3 -out server.key 4096
openssl req -passin pass:1111 -new -key server.key -out server.csr -subj  "/C=FR/ST=Paris/L=Paris/O=Test/OU=Server/CN=localhost"
openssl x509 -req -passin pass:1111 -days 365 -in server.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out server.crt
openssl rsa -passin pass:1111 -in server.key -out server.key
openssl genrsa -passout pass:1111 -des3 -out client.key 4096
openssl req -passin pass:1111 -new -key client.key -out client.csr -subj  "/C=FR/ST=Paris/L=Paris/O=Test/OU=Client/CN=localhost"
openssl x509 -passin pass:1111 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt
openssl rsa -passin pass:1111 -in client.key -out client.key

```

./keys/ :

```
keys/
├── ca.crt
├── ca.key
├── client.crt
├── client.csr
├── client.key
├── server.crt
├── server.csr
└── server.key
```

### Step 3: Specify named services

[./proto/demo/hello.proto](./proto/demo/hello.proto):

```
syntax = "proto3";
package hello;

// The greeting service definition.
service Greeter {
    // Sends a greeting
    rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
    string name = 1;
}

// The response message containing the greetings
message HelloReply {
    string message = 1;
}
```

### Step 4: Server and client

[./grpc_auth/server.js](./grpc_auth/server.js):

```
const fs = require('fs');
const grpc = require('grpc');

const PROTO_PATH = __dirname + '/../proto/demo/hello.proto';
const HelloProto = grpc.load(PROTO_PATH).hello;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
    callback(null, { message: 'Hello ' + call.request.name });
}

const server = new grpc.Server();
server.addService(HelloProto.Greeter.service, {
    sayHello: sayHello
});
server.bind('0.0.0.0:9001', grpc.ServerCredentials.createSsl(
    fs.readFileSync('./keys/ca.crt'),  [
    {
        private_key: fs.readFileSync('./keys/server.key'),
        cert_chain: fs.readFileSync('./keys/server.crt')
    }
], true));
server.start();
```

[./grpc_auth/client.js](./grpc_auth/client.js):

```
const grpc = require('grpc');
const fs = require('fs');

const PROTO_PATH = __dirname + '/../proto/demo/hello.proto';
const HelloProto = grpc.load(PROTO_PATH).hello;

const client = new HelloProto.Greeter('localhost:9001', grpc.credentials.createSsl(
    fs.readFileSync('./keys/ca.crt'),  
    fs.readFileSync('./keys/client.key'),
    fs.readFileSync('./keys/client.crt'),
));

client.sayHello({ name: 'World'}, function(err, response) {
    console.log(err);
    console.log('Greeting res:', response.message);
});
```

### Step 5: Run server and client

`node .\grpc_auth\server.js`

then

`node .\grpc_auth\client.js`

output: 

```
null
Greeting res: Hello World
```

If without certificates:

```
const client = new HelloProto.Greeter('localhost:9001', grpc.credentials.createSsl(
    // fs.readFileSync('./keys/ca.crt'),  
    // fs.readFileSync('./keys/client.key'),
    // fs.readFileSync('./keys/client.crt'),
));
```

output should be:

```
E0409 10:22:29.239000000 11968 ssl_transport_security.cc:989] Handshake failed with fatal error SSL_ERROR_SSL: error:1000007d:SSL routines:OPENSSL_internal:CERTIFICATE_VERIFY_FAILED.
E0409 10:22:29.259000000 11968 ssl_transport_security.cc:989] Handshake failed with fatal error SSL_ERROR_SSL: error:1000007d:SSL routines:OPENSSL_internal:CERTIFICATE_VERIFY_FAILED.
{ Error: 14 UNAVAILABLE: Connect Failed
    at new createStatusError 
    ...
  code: 14,
  metadata: Metadata { _internal_repr: {} },
  details: 'Connect Failed' }
```