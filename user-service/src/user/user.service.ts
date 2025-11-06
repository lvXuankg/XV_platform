import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { errorHandling } from 'src/common/constants/error-handling';
import { getConfig } from 'src/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { ReportUserDto } from './dto/report-user.dto';
import { responseMessages } from 'src/common/constants/response-message';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getProfile(userId: bigint) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async typingFindUsers(text: string) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: text,
              mode: 'insensitive',
            },
          },
          {
            username: {
              contains: text,
              mode: 'insensitive',
            },
          },
        ],
        role: {
          in: getConfig().system.roleCanFinds as any,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar_url: true,
      },
      take: getConfig().system.quantityUserResponse as number,
    });

    return users.map((user) => JSON.stringify(user));
  }

  async findUsers(
    text: string,
    cursor?: string,
    limit?: number,
    order: 'asc' | 'desc' = 'asc',
  ) {
    const sanitizedText = (text || '').trim().substring(0, 100);
    const sanitizedLimit = limit
      ? Math.min(Math.max(parseInt(String(limit)), 1), 100)
      : getConfig().system.quantityUserResponse;

    return this.paginationService.paginate({
      model: this.prisma.user,
      where: {
        OR: [
          {
            name: {
              contains: sanitizedText,
              mode: 'insensitive' as const,
            },
          },
          {
            username: {
              contains: sanitizedText,
              mode: 'insensitive' as const,
            },
          },
        ],
        role: {
          in: (getConfig().system.roleCanFinds as any) || [
            'member',
            'memberVip',
          ],
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        avatar_url: true,
      },
      orderBy: {
        id: order,
      },
      cursor,
      limit: sanitizedLimit,
    });
  }

  async updateProfile(userId: bigint, data: UpdateProfileDto) {
    const { username, email } = data;

    if (username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          AND: [{ username }, { id: { not: userId } }],
        },
        select: { id: true },
      });

      if (existingUser) {
        throw new ConflictException(errorHandling.duplicateUsername.message);
      }
    }

    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          AND: [{ email }, { id: { not: userId } }],
        },
        select: { id: true },
      });

      if (existingUser) {
        throw new ConflictException(errorHandling.duplicateEmail.message);
      }
    }

    const result = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.username && { username: data.username }),
        ...(data.bio && { bio: data.bio }),
        ...(data.email && { email: data.email }),
        ...(data.avatarUrl && { avatar_url: data.avatarUrl }),
        ...(data.facebookUrl && { facebook_url: data.facebookUrl }),
        ...(data.zaloPhone && { zalo_phone: data.zaloPhone }),
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        bio: true,
        avatar_url: true,
        facebook_url: true,
        zalo_phone: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return result;
  }

  async followUser(userId: bigint, targetUserId: bigint) {
    if (targetUserId === userId) {
      throw new BadRequestException(
        errorHandling.cannotXYourSelf('theo dõi').message,
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    try {
      const result = await this.prisma.actionUsers.create({
        data: {
          user_id: userId,
          target_user_id: targetUserId,
          action_types: 'follow',
        },
      });

      return {
        message: 'Theo dõi người dùng thành công',
        data: result,
      };
    } catch (error) {
      // Nếu lỗi duplicate key, đã follow rồi
      if (error.code === 'P2002') {
        return {
          message: 'Bạn đã theo dõi người dùng này',
          data: null,
        };
      }
      throw error;
    }
  }

  async unfollowUser(userId: bigint, targetUserId: bigint) {
    if (targetUserId === userId) {
      throw new BadRequestException(
        errorHandling.cannotXYourSelf('bỏ theo dõi').message,
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    const result = await this.prisma.actionUsers.delete({
      where: {
        user_id_target_user_id_action_types: {
          user_id: userId,
          target_user_id: targetUserId,
          action_types: 'follow',
        },
      },
    });

    return {
      message: 'Hủy theo dõi người dùng thành công',
      data: result,
    };
  }

  async blockUser(userId: bigint, targetUserId: bigint, dto: BlockUserDto) {
    if (targetUserId === userId) {
      throw new BadRequestException(
        errorHandling.cannotXYourSelf('chặn').message,
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    const sanitizedReason = (dto.reason || '').trim().substring(0, 500);

    try {
      const result = await this.prisma.actionUsers.create({
        data: {
          user_id: userId,
          target_user_id: targetUserId,
          action_types: 'block',
          content: sanitizedReason,
        },
      });

      return {
        message: 'Chặn người dùng thành công',
        data: result,
      };
    } catch (error) {
      // Nếu lỗi duplicate key, đã chặn rồi
      if (error.code === 'P2002') {
        return {
          message: 'Bạn đã chặn người dùng này',
          data: null,
        };
      }
      throw error;
    }
  }

  async unblockUser(userId: bigint, targetUserId: bigint) {
    if (targetUserId === userId) {
      throw new BadRequestException(
        errorHandling.cannotXYourSelf('bỏ chặn').message,
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    const result = await this.prisma.actionUsers.delete({
      where: {
        user_id_target_user_id_action_types: {
          user_id: userId,
          target_user_id: targetUserId,
          action_types: 'block',
        },
      },
    });

    return {
      message: 'Bỏ chặn người dùng thành công',
      data: result,
    };
  }

  async reportUser(userId: bigint, targetUserId: bigint, dto: ReportUserDto) {
    if (targetUserId === userId) {
      throw new BadRequestException(
        errorHandling.cannotXYourSelf('báo cáo').message,
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    const sanitizedReason = (dto.reason || '').trim().substring(0, 1000);

    try {
      const result = await this.prisma.actionUsers.create({
        data: {
          user_id: userId,
          target_user_id: targetUserId,
          action_types: 'report',
          content: sanitizedReason,
        },
      });

      return {
        message: 'Báo cáo người dùng thành công',
        data: result,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        return {
          message: 'Bạn đã báo cáo người dùng này',
          data: null,
        };
      }
      throw error;
    }
  }

  async unreportUser(userId: bigint, targetUserId: bigint) {
    if (targetUserId === userId) {
      throw new BadRequestException(
        errorHandling.cannotXYourSelf('bỏ báo cáo').message,
      );
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!targetUser) {
      throw new NotFoundException(errorHandling.userNotFound.message);
    }

    const result = await this.prisma.actionUsers.delete({
      where: {
        user_id_target_user_id_action_types: {
          user_id: userId,
          target_user_id: targetUserId,
          action_types: 'report',
        },
      },
    });

    return {
      message: 'Bỏ báo cáo người dùng thành công',
      data: result,
    };
  }
}
