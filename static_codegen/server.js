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