import { Injectable } from '@nestjs/common';
import { BlogType, Reaction } from '@prisma/client';
import { EditBlogDto } from 'src/blogs/dto/update-blog.dto';
import { writeBlogDto } from 'src/blogs/dto/write-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BlogRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(userId: number, dto: writeBlogDto, blogType: BlogType) {
    const { id } = await this.prisma.blogs.create({
      data: { ...dto, authorId: userId, blogType: blogType },
    });
    return id;
  }
  async findBlogById(blogId: number) {
    return await this.prisma.blogs.findUnique({
      where: {
        id: blogId,
      },
    });
  }
  async findBlogByTitle(title: string) {
    return await this.prisma.blogs.findUnique({
      where: {
        title: title,
      },
    });
  }

  async getBlogs(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    return await this.prisma.blogs.findMany({
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      skip: skip,
      take: pageSize,
    });
  }
  async getCount() {
    return await this.prisma.blogs.count();
  }

  async getBlog(id: number) {
    return await this.prisma.blogs.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async createComment(blogId: number, content: string, authorId: number) {
    return await this.prisma.comments.create({
      data: { content, authorId, blogId },
    });
  }

  async getBlogComments(blogId: number) {
    return this.prisma.comments.findMany({
      where: { blogId: blogId },
      include: {
        author: { select: { firstName: true, lastName: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteReaction(blogId: number, userId: number) {
    const existingReaction = await this.prisma.blogReaction.findFirst({
      where: {
        blogId: blogId,
        userId: userId,
      },
    });

    if (!existingReaction) {
      return;
    }
    await this.prisma.blogReaction.delete({
      where: {
        id: existingReaction.id,
      },
    });
  }

  //! merge to one
  async getLike(blogId: number, userId: number) {
    return await this.prisma.blogReaction.findFirst({
      where: {
        blogId: blogId,
        userId: userId,
        reaction: Reaction.LIKE,
      },
      select: {
        id: true,
      },
    });
  }

  async getDisLike(blogId: number, userId: number) {
    return await this.prisma.blogReaction.findFirst({
      where: {
        blogId: blogId,
        userId: userId,
        reaction: Reaction.DISLIKE,
      },
      select: {
        id: true,
      },
    });
  }

  async likeBlog(blogId: number, userId: number) {
    await this.prisma.blogReaction.create({
      data: { blogId, userId, reaction: Reaction.LIKE },
    });
  }

  async disLikeBlog(blogId: number, userId: number) {
    await this.prisma.blogReaction.create({
      data: { blogId, userId, reaction: Reaction.DISLIKE },
    });
  }
  async getReactionCount(blogId: number, reaction: Reaction) {
    return await this.prisma.blogReaction.count({
      where: {
        blogId: blogId,
        reaction: reaction,
      },
    });
  }

  async getCommentsCount(blogId: number) {
    return await this.prisma.comments.count({
      where: {
        blogId: blogId,
      },
    });
  }

  async getUserReaction(
    blogId: number,
    userId: number,
  ): Promise<{ reaction: Reaction }> {
    return await this.prisma.blogReaction.findFirst({
      where: {
        blogId: blogId,
        userId: userId,
      },
      select: {
        reaction: true,
      },
    });
  }

  async getUserBlogs(
    userId: number,
    type: BlogType,
    page: number,
    pageSize: number,
  ) {
    const skip = (page - 1) * pageSize;
    return await this.prisma.blogs.findMany({
      where: {
        authorId: userId,
        blogType: type,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      skip: skip,
      take: pageSize,
    });
  }

  async getUserBlogsCount(userId: number, type: BlogType) {
    return await this.prisma.blogs.count({
      where: {
        authorId: userId,
        blogType: type,
      },
    });
  }

  async deleteBlog(blogId: number) {
    return this.prisma.blogs.delete({
      where: {
        id: blogId,
      },
    });
  }

  async updateBlog(blogId: number, value: UpdateBlogData) {
    return this.prisma.blogs.update({
      where: {
        id: blogId,
      },
      data: value,
    });
  }
}

export type UpdateBlogData = Omit<EditBlogDto, 'id'>;
