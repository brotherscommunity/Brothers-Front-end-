import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { writeBlogDto } from './dto/write-blog.dto';
import { BlogRepository } from 'src/shared/repositories/blog.repository';
import { BlogType, Reaction } from '@prisma/client';
import { StatusOk } from 'src/auth/types/status-ok';
import { EditBlogDto } from './dto/update-blog.dto';

//! not found exception can be implemented in a guard
@Injectable()
export class BlogsService {
  constructor(private readonly blogRepository: BlogRepository) {}
  async createBlog(
    userId: number,
    dto: writeBlogDto,
    blogType: BlogType = BlogType.Blog,
  ): Promise<{ id: number }> {
    const existedBlog = await this.blogRepository.findBlogByTitle(dto.title);
    if (existedBlog)
      throw new ConflictException('A blog with similar title existes!');
    const id = await this.blogRepository.create(userId, dto, blogType);
    return { id };
  }

  async getBlogsList(page: number, pageSize: number) {
    //! find a better way of counting or save it in a table
    const blogsCount: number = await this.blogRepository.getCount();
    const blogs = await this.blogRepository.getBlogs(page, pageSize);
    return {
      blogs,
      count: blogsCount,
    };
  }

  async getBlog(id: number) {
    const blog = await this.blogRepository.getBlog(id);
    if (!blog) throw new NotFoundException('No blog found with this id!');
    return blog;
  }

  async getBlogStat(id: number): Promise<{
    commentsCount: number;
    likesCount: number;
    dislikesCount: number;
  }> {
    const blog = await this.blogRepository.getBlog(id);
    if (!blog) throw new NotFoundException('No blog found with this id!');
    //get view
    //comments
    const commentsCount: number =
      await this.blogRepository.getCommentsCount(id);
    //like
    const likesCount: number = await this.blogRepository.getReactionCount(
      id,
      Reaction.LIKE,
    );
    //dislike
    const dislikesCount: number = await this.blogRepository.getReactionCount(
      id,
      Reaction.DISLIKE,
    );

    return {
      commentsCount,
      likesCount,
      dislikesCount,
    };
  }

  async writeComment(id: number, content: string, userId: number) {
    const blog = await this.blogRepository.getBlog(id);
    if (!blog) throw new NotFoundException('No blog found with this id!');
    return this.blogRepository.createComment(id, content, userId);
  }
  async getComments(blogId: number) {
    const blog = await this.blogRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException('No blog found with this id!');
    return this.blogRepository.getBlogComments(blogId);
  }

  async likeBlog(blogId: number, userId: number): Promise<StatusOk> {
    const blog = await this.blogRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException('No blog found with this id!');
    const isLiked = await this.blogRepository.getLike(blogId, userId);

    await this.blogRepository.deleteReaction(blogId, userId);
    if (!isLiked) {
      await this.blogRepository.likeBlog(blogId, userId);
    }
    return { message: 'Liked', status: '200' };
  }

  async disLikeBlog(blogId: number, userId: number) {
    const blog = await this.blogRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException('No blog found with this id!');
    const isDisLiked = await this.blogRepository.getDisLike(blogId, userId);

    await this.blogRepository.deleteReaction(blogId, userId);
    if (!isDisLiked) {
      await this.blogRepository.disLikeBlog(blogId, userId);
    }
  }

  async getUserReaction(
    id: number,
    userId: number,
  ): Promise<{ reaction: Reaction }> {
    const blog = await this.blogRepository.getBlog(id);
    if (!blog) throw new NotFoundException('No blog found with this id!');
    return this.blogRepository.getUserReaction(id, userId);
  }

  async getUserBlogs(
    userId: number,
    type: BlogType,
    page: number,
    pageSize: number,
  ): Promise<{ blogs: any; count: number }> {
    const blogs = await this.blogRepository.getUserBlogs(
      userId,
      type,
      page,
      pageSize,
    );
    const count = await this.blogRepository.getUserBlogsCount(userId, type);
    return {
      blogs,
      count,
    };
  }

  async deleteBlog(blogId: number, userId: number) {
    const blog = await this.blogRepository.getBlog(blogId);
    if (!blog) throw new NotFoundException('No blog found with this id!');

    if (blog.authorId !== userId) throw new UnauthorizedException();
    await this.blogRepository.deleteBlog(blogId);
  }

  async editBlog(dto: EditBlogDto, userId: number) {
    const { id, ...rest } = dto;
    const blog = await this.blogRepository.getBlog(id);
    if (!blog) throw new NotFoundException('No blog found with this id!');

    const blogWithSameTitle = await this.blogRepository.findBlogByTitle(
      dto.title,
    );

    if (blogWithSameTitle && blogWithSameTitle.id !== dto.id) {
      throw new ConflictException('A blog with same title exists');
    }

    if (blog.authorId !== userId) throw new UnauthorizedException();

    await this.blogRepository.updateBlog(id, rest);
  }
}
