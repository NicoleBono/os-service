import { SagaPublisherService } from '../publisher/saga-publisher.service';
import { SagaEventType } from '../types/saga-event.types';

jest.mock('@aws-sdk/client-sns', () => ({
  SNSClient: jest.fn().mockImplementation(() => ({ send: jest.fn().mockResolvedValue({}) })),
  PublishCommand: jest.fn(),
}));

describe('SagaPublisherService', () => {
  let service: SagaPublisherService;

  beforeEach(() => { service = new SagaPublisherService(); });

  it('deve logar warn quando SAGA_SNS_TOPIC_ARN não está configurado', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await service.publish(SagaEventType.OS_CREATED, 1, {});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('deve publicar quando topicArn está configurado', async () => {
    process.env.SAGA_SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123:test';
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await service.publish(SagaEventType.OS_CREATED, 1, { test: true });
    expect(spy).toHaveBeenCalled();
    delete process.env.SAGA_SNS_TOPIC_ARN;
    spy.mockRestore();
  });
});
