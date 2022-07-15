import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkStarterStackStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaConfig: NodejsFunctionProps = {
      entry: './functions/index.ts',
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'main',
      memorySize: 128,
    };

    // lambda without provisioned concurrency
    const unprovisionedFn = new NodejsFunction(this, 'UnprovisionedFunction', {
      ...lambdaConfig,
    });

    // lambda with provisioned concurrency
    const provisionedFn = new NodejsFunction(this, 'ProvisionedFunction', {
      ...lambdaConfig,
    });

    // add version alias to provisioned function
    const version = new lambda.Version(this, 'ProvisionedConcurrency', {
      lambda: provisionedFn,
      description: 'Provisioned',
      provisionedConcurrentExecutions: 1,
    });

    // output function name for testing
    new CfnOutput(this, 'UnprovisionedFunctionName', {
      value: unprovisionedFn.functionName,
    });
    new CfnOutput(this, 'ProvisionedFunctionName', {
      value: provisionedFn.functionName,
    });
  }
}
