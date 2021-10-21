import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as asg from '@aws-cdk/aws-autoscaling';
import * as fs from 'fs';
import * as path from 'path';


export class HAWebServerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import user data
    const userData = fs.readFileSync(path.resolve('bootstrap_scripts/install_httpd.sh'),'utf-8');

    // Create Application Load Balancer
    const myAlb = new elbv2.ApplicationLoadBalancer(this, 'MyAlb',{
    	vpc,
	internetFacing: true,
	loadBalancerName: 'WebServerAlb'
    });

    // Add listener for Load Balancer
    const myAlbListener = myAlb.addListener('MyAlbListener', {
    	port: 80,
	open: true
    });

    // Create AutoScaling Group
    const webServerASG = new asg.AutoScalingGroup(this, 'MyWebServerASG',{
    	vpc,
	instanceType: new ec2.InstanceType('t2.micro'),
	machineImage: ec2.MachineImage.latestAmazonLinux({
	    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2
	}),
	minCapacity: 1,
	maxCapacity: 3,
	desiredCapacity: 2,
	userData: ec2.UserData.custom(userData)
    });

    // Add AutoScaling Group as target for Load Balancer listener
    myAlbListener.addTargets('MyAlbListener',{
    	port: 80,
	targets: [webServerASG]
    });

    // Add Role for AutoScaling Group to access SSM and S3
    webServerASG.role.addManagedPolicy(
    	iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );
    webServerASG.role.addManagedPolicy(
    	iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess')
    );

    // Output the AutoScaling Group DNS value
    new cdk.CfnOutput(this,'AlbDNSName',{
    	value: `http://${myAlb.loadBalancerDnsName}`,
	description: 'Web Server ALB Domain Name'
    });

  }
}
