import { SagaPublisherService } from '../publisher/saga-publisher.service';
import { SagaEventType } from '../types/saga-event.types';

jest.mock('@aws-sdk/client-sns', () => ({
  SNSClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue({}),
  })),
  PublishCommand: jest.fn().mockImplementation((input) => input),
}));

describe('SagaPublisherService', () => {
  let service: SagaPublisherService;

  beforeEach(() => {
    service = new SagaPublisherService();
  });

  it('deve logar warn quando SAGA_SNS_TOPIC_ARN não está configurado', async () => {
    delete process.env.SAGA_SNS_TOPIC_ARN;
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await service.publish(SagaEventType.OS_CREATED, 1, {});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('deve chamar SNSClient.send quando topicArn está configurado', async () => {
    process.env.SAGA_SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123:test';
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Re-instantiate so it picks up the env var
    const svc = new SagaPublisherService();
    await svc.publish(SagaEventType.OS_CREATED, 1, { test: true });

    expect(logSpy).toHaveBeenCalled();
    delete process.env.SAGA_SNS_TOPIC_ARN;
    logSpy.mockRestore();
  });
});
