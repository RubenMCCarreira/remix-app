import { redirect, Form, useActionData, useTransition, LoaderFunction, useLoaderData } from 'remix';
import type { ActionFunction } from 'remix';
import invariant from 'tiny-invariant';
import { createPost, getPost, Post, updatePost } from '~/posts';
import { ChangeEvent, useState } from 'react';

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');

  return getPost(params.slug, false);
};

export const action: ActionFunction = async ({ request, params }) => {
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();

  const title = formData.get('title');
  const slug = formData.get('slug');
  const markdown = formData.get('markdown');

  const errors: PostError = {};

  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === 'string');
  invariant(typeof slug === 'string');
  invariant(typeof markdown === 'string');

  await updatePost(params.slug!, { title, slug, markdown });

  return redirect('/admin');
};

function EditPost() {
  const original = useLoaderData<Post>();
  const [post, setPost] = useState(original);
  const errors = useActionData();
  const transition = useTransition();

  const onChange = (prop: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [prop]: event.target.value });
  };

  const onChangeMarkdown = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPost({ ...post, markdown: event.target.value });
  };

  return (
    <Form method="post">
      <p>
        <label>
          Post Title: {errors?.title ? <em>Title is required</em> : null}
          <input type="text" name="title" value={post.title} onChange={onChange('title')} />
        </label>
      </p>
      <p>
        <label>
          Post Slug: {errors?.slug ? <em>Slug is required</em> : null}
          <input type="text" name="slug" value={post.slug} onChange={onChange('slug')} />
        </label>
      </p>
      <p>
        <label htmlFor="markdown">Markdown:</label> {errors?.markdown ? <em>Markdown is required</em> : null}
        <br />
        <textarea rows={20} name="markdown" value={post.markdown} onChange={onChangeMarkdown} />
      </p>
      <p>
        <button type="submit">{transition.submission ? 'Saving...' : 'Save Post'}</button>
      </p>
    </Form>
  );
}

export default EditPost;
