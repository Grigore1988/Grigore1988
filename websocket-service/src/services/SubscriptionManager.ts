import { RedisClientType } from 'redis';
import { Logger } from 'winston';

export class SubscriptionManager {
  constructor(private redisClient: RedisClientType, private logger: Logger) {}

  async initialize(): Promise<void> {
    this.logger.info('SubscriptionManager initialized');
  }

  async subscribe(userId: string, symbols: string[]): Promise<void> {
    for (const symbol of symbols) {
      await this.redisClient.sAdd(`subscriptions:${symbol}`, userId);
      await this.redisClient.sAdd(`user_subscriptions:${userId}`, symbol);
    }
    this.logger.info(`User ${userId} subscribed to ${symbols.join(', ')}`);
  }

  async unsubscribe(userId: string, symbols: string[]): Promise<void> {
    for (const symbol of symbols) {
      await this.redisClient.sRem(`subscriptions:${symbol}`, userId);
      await this.redisClient.sRem(`user_subscriptions:${userId}`, symbol);
    }
    this.logger.info(`User ${userId} unsubscribed from ${symbols.join(', ')}`);
  }

  async getActiveSymbols(): Promise<string[]> {
    const keys = await this.redisClient.keys('subscriptions:*');
    return keys.map(key => key.replace('subscriptions:', ''));
  }

  async cleanupUserSubscriptions(userId: string): Promise<void> {
    const symbols = await this.redisClient.sMembers(`user_subscriptions:${userId}`);
    for (const symbol of symbols) {
      await this.redisClient.sRem(`subscriptions:${symbol}`, userId);
    }
    await this.redisClient.del(`user_subscriptions:${userId}`);
    this.logger.info(`Cleaned up subscriptions for user ${userId}`);
  }
}