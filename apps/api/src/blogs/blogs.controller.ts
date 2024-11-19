import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { writeBlogDto } from './dto/write-blog.dto';
import { BlogType } from '@prisma/client';
import { Public } from 'src/shared/decorators/public.decorator';
import { StatusOk } from 'src/auth/types/status-ok';
import { EditBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  @Post('write-blog')
  WriteBlog(@Req() req, @Body() dto: writeBlogDto): Promise<{ id: number }> {
    return this.blogsService.createBlog(req.user.id, dto);
  }

  @Post('write-vblog')
  WriteVBlog(@Req() req, @Body() dto: writeBlogDto): Promise<{ id: number }> {
    return this.blogsService.createBlog(req.user.id, dto, BlogType.VBlog);
  }

  @Public()
  @Get('list')
  blogsList(
    // @Res() res: Response,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '6',
  ) {
    //! validtion
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);
    return this.blogsService.getBlogsList(pageNumber, pageSizeNumber);
    // res.status(200).json(data); // Force a 200 OK status
  }
  @Public()
  @Get(':id')
  getBlog(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.getBlog(id);
  }

  @Public()
  @Get(':id/stat')
  getBlogStat(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.getBlogStat(id);
  }

  @Get(':id/reaction')
  getUserBlogReaction(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.blogsService.getUserReaction(id, req.user.id);
  }

  @Post(':id/write-comment')
  writeComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() { content }: { content: string },
    @Req() req,
  ) {
    return this.blogsService.writeComment(id, content, req.user.id);
  }

  @Public()
  @Get(':id/comments')
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.getComments(id);
  }

  @Patch(':id/like')
  likeBlog(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<StatusOk> {
    return this.blogsService.likeBlog(id, req.user.id);
  }

  @Patch(':id/dislike')
  dislikeBlog(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.blogsService.disLikeBlog(id, req.user.id);
  }

  //! edit parseint pipe to take default value
  @Public()
  @Get('user/blog/:id')
  getUserBlogs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 6,
  ) {
    return this.blogsService.getUserBlogs(id, BlogType.Blog, page, pageSize);
  }

  @Public()
  @Get('user/vblog/:id')
  getUserVBlogs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 6,
  ) {
    return this.blogsService.getUserBlogs(id, BlogType.VBlog, page, pageSize);
  }

  //! protect delete and edit with guard
  @Delete(':id/delete')
  deleteBlog(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.blogsService.deleteBlog(id, req.user.id);
  }

  @Patch(':id/edit')
  editBlog(@Body() dto: EditBlogDto, @Req() req) {
    //remove after validation pipe is ixed
    const { id } = dto;
    const blogId = parseInt(`${id}`);
    console.log({ ...dto, id: blogId });
    return this.blogsService.editBlog({ ...dto, id: blogId }, req.user.id);
  }
}
