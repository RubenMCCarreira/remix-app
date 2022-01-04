import { Link, Outlet } from 'remix';

function AdminIndex() {
  return (
    <>
      <p>
        <Link to="new">Create a New Post</Link>
      </p>
      <p>
        <Link to="edit">Edit Post</Link>
      </p>
    </>
  );
}

export default AdminIndex;
