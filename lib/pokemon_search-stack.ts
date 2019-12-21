import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import { Duration } from '@aws-cdk/core';
import apigw = require('@aws-cdk/aws-apigateway');
import dynamodb = require("@aws-cdk/aws-dynamodb");

export class PokemonSearchStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pokemonSearch = new lambda.Function(this, 'PokemonSearchHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      timeout: Duration.seconds(30)
    });

    const api = new apigw.LambdaRestApi(this, 'PokemonSearchAPI', {
      handler: pokemonSearch,
      proxy: false
    });

    const pokemon = api.root.addResource('{pokemon}')
    pokemon.addMethod('GET')

    new dynamodb.Table(this, "PokemonTable", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      }
    });
  }
}
