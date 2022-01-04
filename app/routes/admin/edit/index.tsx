import { useLoaderData, Link, Outlet } from 'remix';
import { getPosts, Post } from '~/posts';

export const loader = () => {
  return getPosts();
};

function EditIndex() {
  const posts = useLoaderData<Post[]>();

  return (
    <>
      <p>Select one to edit</p>
      <ul id="edit-posts">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default EditIndex;
