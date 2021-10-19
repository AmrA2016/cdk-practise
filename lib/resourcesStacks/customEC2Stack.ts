import * as cdk from '@aws-cdk/core';
import * as ec2  from '@aws-cdk/aws-ec2';

export class CustomEC2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import default VPC
    const defaultVpc = ec2.Vpc.fromLookup(this, "ImportedVPC",{
    	isDefault: true
    });

    // Create the security group
    const securityGroup = new ec2.SecurityGroup(this, "common-sg",{
    	allowAllOutbound: true,
	vpc: defaultVpc,
	securityGroupName: "common-sg"
    });

    // Allow SSH Connection
    securityGroup.addIngressRule(
  	ec2.Peer.anyIpv4(),
	ec2.Port.tcp(22),
	"Allow SSH connection from internet"
    )

    const dateTime = new Date();
    // Create EC2 Instance
    const myInstance = new ec2.Instance(this, "SampleInstance",{
    	instanceName: "SampleInstance-" + dateTime,
	vpc: defaultVpc,
	securityGroup: securityGroup,
	instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
	machineImage: ec2.MachineImage.latestAmazonLinux({
	    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
	})
    });

    // Get Instance Public IP
    new cdk.CfnOutput(this, 'SampleInstanceOutput', {
      value: myInstance.instancePublicIp
    })

  }
}
