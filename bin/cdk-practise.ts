#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyArtifactBucketStack } from '../lib/myFirstStack';
import { CustomVPCStack } from '../lib/resourcesStacks';

const app = new cdk.App();

cdk.Tag.add(app, "StackOwner", "Amr Atef")

const DEV_ENV = { 
	account: app.node.tryGetContext('envs')['dev']['account'],
	region: app.node.tryGetContext('envs')['dev']['region']
}

const PROD_ENV = { 
	account: app.node.tryGetContext('envs')['prod']['account'],
	region: app.node.tryGetContext('envs')['prod']['region']
}

/*
// Create Artifact S3 Bucket
new MyArtifactBucketStack(app, 'MyDevStack', false, {
  env: DEV_ENV,
});


new MyArtifactBucketStack(app, 'MyProdStack', true, {
  env: PROD_ENV,
});
*/

new CustomVPCStack(app, 'CustomVPCStack', {
  env: PROD_ENV
});


