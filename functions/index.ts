import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

const doWork = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('result');
    }, 1000);
  });
};

export async function main(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const res = await doWork();
  return {
    body: res,
    statusCode: 200,
    isBase64Encoded: false,
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
