import CreatePostForm from "../components/post/CreatePostForm";
export default function CreatePost() {
  return (
    <div className="min-h-screen py-6">
      <div className="sticky top-0 z-10 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-4 mb-6">
        <h1 className="font-bold text-xl text-gray-900 dark:text-gray-100 text-center">Create new post</h1>
      </div>
      <CreatePostForm />
    </div>
  );
}
