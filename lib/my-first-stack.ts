import * as cdk from '@aws-cdk/core';
import * as s3  from '@aws-cdk/aws-s3';

export class MyFirstStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myBucket = new s3.Bucket(this, 'MyCDKBucket',{
    	encryption: s3.BucketEncryption.KMS,
	blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
	removalPolicy: cdk.RemovalPolicy.DESTROY,
	autoDeleteObjects: true	
    });

    console.log(myBucket.bucketName);
  }
}
