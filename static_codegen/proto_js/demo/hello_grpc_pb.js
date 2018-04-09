// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var demo_hello_pb = require('../demo/hello_pb.js');

function serialize_hello_HelloReply(arg) {
  if (!(arg instanceof demo_hello_pb.HelloReply)) {
    throw new Error('Expected argument of type hello.HelloReply');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_hello_HelloReply(buffer_arg) {
  return demo_hello_pb.HelloReply.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_hello_HelloRequest(arg) {
  if (!(arg instanceof demo_hello_pb.HelloRequest)) {
    throw new Error('Expected argument of type hello.HelloRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_hello_HelloRequest(buffer_arg) {
  return demo_hello_pb.HelloRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// The greeting service definition.
var GreeterService = exports.GreeterService = {
  // Sends a greeting
  sayHello: {
    path: '/hello.Greeter/SayHello',
    requestStream: false,
    responseStream: false,
    requestType: demo_hello_pb.HelloRequest,
    responseType: demo_hello_pb.HelloReply,
    requestSerialize: serialize_hello_HelloRequest,
    requestDeserialize: deserialize_hello_HelloRequest,
    responseSerialize: serialize_hello_HelloReply,
    responseDeserialize: deserialize_hello_HelloReply,
  },
};

exports.GreeterClient = grpc.makeGenericClientConstructor(GreeterService);
