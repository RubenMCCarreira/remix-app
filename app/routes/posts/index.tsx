import { Link, useLoaderData } from 'remix';
import { getPosts, Post } from '~/posts';

export const loader = () => {
  return getPosts();
};

function Posts() {
  const posts = useLoaderData<Post[]>();

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
