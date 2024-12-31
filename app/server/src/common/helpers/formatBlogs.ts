import { Blog } from '@prisma/client';
import { from, map, toArray } from 'rxjs';

export const formatBlogs = (
  blogs: (Blog & {
    author: {
      f_name: string;
      l_name: string;
      avatar: string;
    };
    _count: {
      comments: number;
      likes: number;
    };
  })[],
) => {
  const result = from(blogs).pipe(
    map((blog) => {
      return {
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        summary: blog.summary,
        content: blog.content,
        author: `${blog.author.f_name} ${blog.author.l_name}`,
        authorAvatar: blog.author.avatar,
        published: blog.published,
        coverImage: blog.coverImage,
        read: blog.read,
        likes: blog._count?.likes,
        comments: blog._count?.comments,
      };
    }),
    toArray(),
  );
  return result;
};
