import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Notification,
  NotificationDocument,
  NotificationType,
  NotificationChannel
} from "../../common/schemas/notification.schema";

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    channel: NotificationChannel,
    title: string,
    content: string,
    data?: Record<string, any>
  ): Promise<NotificationDocument> {
    const notification = await this.notificationModel.create({
      userId,
      type,
      channel,
      title,
      content,
      data: data || {},
      read: false,
      sent: false
    });

    // 根据渠道发送通知
    if (channel === NotificationChannel.IN_APP) {
      // WebSocket 推送（需要集成）
    } else if (channel === NotificationChannel.EMAIL) {
      // 发送邮件（需要集成邮件服务）
    } else if (channel === NotificationChannel.SMS) {
      // 发送短信（需要集成短信服务）
    }

    notification.sent = true;
    notification.sentAt = new Date();
    await notification.save();

    return notification;
  }

  async findByUser(userId: string, unreadOnly = false): Promise<NotificationDocument[]> {
    const query: any = { userId };
    if (unreadOnly) {
      query.read = false;
    }
    return this.notificationModel.find(query).sort({ createdAt: -1 }).limit(50).exec();
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findOne({
      _id: notificationId,
      userId
    }).exec();
    if (!notification) {
      throw new Error("通知不存在");
    }
    notification.read = true;
    notification.readAt = new Date();
    await notification.save();
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { userId, read: false },
      { read: true, readAt: new Date() }
    ).exec();
  }
}

