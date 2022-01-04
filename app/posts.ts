import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';
import { marked } from 'marked';

export type Post = {
  slug: string;
  title: string;
  markdown: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

// relative to the server output not the source!
const postsPath = path.join(__dirname, '..', 'posts');

function isValidPostAttributes(attributes: any): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPosts() {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await fs.readFile(path.join(postsPath, filename));
      const { attributes, body } = parseFrontMatter<Post>(file.toString());
      const markdown = marked(body);

      invariant(isValidPostAttributes(attributes), `${filename} has bad meta data!`);

      return {
        slug: filename.replace(/\.md$/, ''),
        title: attributes.title,
        markdown,
      };
    })
  );
}

export async function getPost(slug: string, convert = true) {
  const filepath = path.join(postsPath, slug + '.md');
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  const nextMarkdown = convert ? marked(body) : body;

  invariant(isValidPostAttributes(attributes), `Post ${filepath} is missing attributes`);

  return { slug, title: attributes.title, markdown: nextMarkdown };
}

export async function createPost(post: Post) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;

  await fs.writeFile(path.join(postsPath, post.slug + '.md'), md);

  return getPost(post.slug);
}

export async function updatePost(oldName: string, post: Post) {
  const md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  const oldPath = path.join(postsPath, oldName + '.md');
  const newPath = path.join(postsPath, post.slug + '.md');

  fs.rename(oldPath, newPath);

  await fs.writeFile(newPath, md);

  return getPost(post.slug);
}
