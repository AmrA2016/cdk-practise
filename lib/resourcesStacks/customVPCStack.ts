import * as cdk from '@aws-cdk/core';
import * as ec2  from '@aws-cdk/aws-ec2';

export class CustomVPCStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcConfig = this.node.tryGetContext("envs")['prod']['vpcConfig'];
    const myCustomVPC = new ec2.Vpc(this, "myCustomVPC",{
	cidr: vpcConfig.cidr,
	natGateways: 1,
	maxAzs: 2,
	subnetConfiguration: [{
	   name: "Public",
	   cidrMask: vpcConfig.cidrMask,
	   subnetType: ec2.SubnetType.PUBLIC
	},
	{
  	   name: "Private",
	   cidrMask: vpcConfig.cidrMask,
	   subnetType: ec2.SubnetType.PRIVATE_WITH_NAT
	},
	{
	   name: "DB",
	   cidrMask: vpcConfig.cidrMask,
	   subnetType: ec2.SubnetType.PRIVATE_ISOLATED
	}
	]
    });
  	
    new cdk.CfnOutput(this,"customVpcOutput",{
            value: myCustomVPC.vpcId,
            exportName: "customVpcId"
    });

     
  }
}
