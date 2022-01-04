import { LoaderFunction, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';
import { getPost, Post } from '~/posts';

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');

  return getPost(params.slug);
};

function PostSlug() {
  const post = useLoaderData<Post>();

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: post.markdown }} />
    </div>
  );
}

export default PostSlug;
