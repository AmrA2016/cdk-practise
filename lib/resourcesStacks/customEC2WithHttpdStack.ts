import * as cdk from '@aws-cdk/core';
import * as ec2  from '@aws-cdk/aws-ec2';
import * as fs from 'fs';
import * as path from 'path';

export class CustomEC2WithHttpdStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Read User Date
    const userData = fs.readFileSync(path.resolve("bootstrap_scripts/install_httpd.sh"), "utf-8");

    // Import default VPC
    const defaultVpc = ec2.Vpc.fromLookup(this, "ImportedVPC",{
    	isDefault: true
    });

    // Create the security group
    const securityGroup = new ec2.SecurityGroup(this, "webserver-sg",{
    	allowAllOutbound: true,
	vpc: defaultVpc,
	securityGroupName: "webserver-sg"
    });

    // Allow SSH Connection
    securityGroup.addIngressRule(
  	ec2.Peer.anyIpv4(),
	ec2.Port.tcp(22),
	"Allow SSH connection from internet"
    )

    const timeStamp = Date.now();
    // Create EC2 Instance
    const myInstance = new ec2.Instance(this, "SampleWebServerInstance",{
    	instanceName: "SampleWebServerInstance_" + timeStamp,
	vpc: defaultVpc,
	securityGroup: securityGroup,
	instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
	machineImage: ec2.MachineImage.latestAmazonLinux({
	    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
	}),
	userData: ec2.UserData.custom(userData)
    });
    
    // Allow Http Connection
    myInstance.connections.allowFromAnyIpv4(ec2.Port.tcp(80), "Allow Http connection from internet");
    
    // Get Instance Public IP
    new cdk.CfnOutput(this, 'SampleWebServerInstancePublicIP', {
      value: myInstance.instancePublicIp
    })

  }
}
