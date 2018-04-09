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