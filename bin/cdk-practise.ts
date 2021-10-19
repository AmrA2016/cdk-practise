#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyArtifactBucketStack } from '../lib/myFirstStack';

const app = new cdk.App();

const DEV_ENV = { 
	account: app.node.tryGetContext('dev')['account'],
	region: app.node.tryGetContext('dev')['region']
}

const PROD_ENV = { 
	account: app.node.tryGetContext('prod')['account'],
	region: app.node.tryGetContext('prod')['region']
}

new MyArtifactBucketStack(app, 'MyDevStack', false, {
  env: DEV_ENV,
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});


new MyArtifactBucketStack(app, 'MyProdStack', true, {
  env: PROD_ENV,
});
