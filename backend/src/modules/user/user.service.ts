import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../../common/schemas/user.schema";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateProfile(userId: string, updates: {
    displayName?: string;
    avatar?: string;
    preferences?: Record<string, any>;
  }): Promise<UserDocument> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException("用户不存在");
    }

    if (updates.displayName !== undefined) {
      user.displayName = updates.displayName;
    }
    if (updates.avatar !== undefined) {
      user.avatar = updates.avatar;
    }
    if (updates.preferences !== undefined) {
      user.preferences = { ...user.preferences, ...updates.preferences };
    }

    await user.save();
    return user;
  }

  async getAgents(): Promise<UserDocument[]> {
    return this.userModel.find({ role: "agent", active: true }).exec();
  }
}

