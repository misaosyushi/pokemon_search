import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import { Duration } from '@aws-cdk/core';
import apigw = require('@aws-cdk/aws-apigateway');
import dynamodb = require("@aws-cdk/aws-dynamodb");

export class PokemonSearchStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableName = 'PokemonTable';

    const pokemonSearch = new lambda.Function(this, 'PokemonSearchHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      timeout: Duration.seconds(30),
      environment:{
        "TABLE_NAME": tableName,
        "CHANNEL_ACCESS_TOKEN": "change_me_later"
      }
    });

    const putData = new lambda.Function(this, 'PutData', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('putData'),
      handler: 'index.handler',
      timeout: Duration.seconds(30),
      environment:{
        "TABLE_NAME": tableName
      }
    });

    const api = new apigw.LambdaRestApi(this, 'PokemonSearchAPI', {
      handler: pokemonSearch,
      proxy: false
    });

    const pokemon = api.root.addResource('pokemon')

    const responseModel = api.addModel('ResponseModel', {
      contentType: 'application/json',
      modelName: 'ResponseModel',
      schema: {}
    });

    pokemon.addMethod('POST', new apigw.LambdaIntegration(pokemonSearch, {
      // 統合レスポンスの設定
      integrationResponses: [
        {
          statusCode: '200',
          contentHandling: apigw.ContentHandling.CONVERT_TO_TEXT,
          responseTemplates: {
            'application/json': "$input.json('$')"
          }
        }
      ],
      passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,
      proxy: false
    }),
        // メソッドレスポンスの設定
        {
          methodResponses: [
            {
              statusCode: '200',
              responseModels: {
                'application/json': responseModel
              }
            }
          ]
        })

    const table = new dynamodb.Table(this, "PokemonTable", {
      tableName: tableName,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING
      }
    });

    // lambdaにDynamoDBの読み取り, 書き込み権限を付与
    table.grantReadData(pokemonSearch)
    table.grantReadWriteData(putData)
  }
}
