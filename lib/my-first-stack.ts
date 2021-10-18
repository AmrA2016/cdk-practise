import * as cdk from '@aws-cdk/core';
import * as s3  from '@aws-cdk/aws-s3';

export class MyArtifactBucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, isProd: boolean, props?: cdk.StackProps) {
    super(scope, id, props);
    let myArtifactBucket = null;
    if(isProd)
    {
    	myArtifactBucket = new s3.Bucket(this, 'MyProdArtifactBucket',{
    	    encryption: s3.BucketEncryption.KMS,
	    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
	    versioned: true,
	    removalPolicy: cdk.RemovalPolicy.DESTROY,
	    autoDeleteObjects: true	
    	});
    }else{
    	myArtifactBucket = new s3.Bucket(this, 'MyDevArtifactBucket',{
	    removalPolicy: cdk.RemovalPolicy.DESTROY,
	    autoDeleteObjects: true	
    	});
    }
  }
}
