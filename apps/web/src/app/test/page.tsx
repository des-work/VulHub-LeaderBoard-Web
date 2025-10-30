export default function TestPage() {
  return (
    <div className="min-h-screen bg-red-500 text-white p-8">
      <h1 className="text-4xl font-bold">Test Page</h1>
      <p className="text-lg">If you can see this with red background and white text, Tailwind is working!</p>
      <div className="bg-blue-500 p-4 rounded-lg mt-4">
        <p>This should be a blue box with rounded corners.</p>
      </div>
    </div>
  );
}
