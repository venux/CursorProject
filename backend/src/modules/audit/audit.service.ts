import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuditLog, AuditLogDocument, AuditAction } from "../../common/schemas/audit-log.schema";

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(AuditLog.name)
    private auditLogModel: Model<AuditLogDocument>
  ) {}

  async log(
    userId: string,
    username: string,
    action: AuditAction,
    resource: string,
    resourceId?: string,
    changes?: Record<string, any>,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLogDocument> {
    return this.auditLogModel.create({
      userId,
      username,
      action,
      resource,
      resourceId,
      changes: changes || {},
      metadata: metadata || {},
      ipAddress,
      userAgent
    });
  }

  async findByUser(userId: string, limit = 100): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByResource(resource: string, resourceId: string): Promise<AuditLogDocument[]> {
    return this.auditLogModel
      .find({ resource, resourceId })
      .sort({ createdAt: -1 })
      .exec();
  }
}

