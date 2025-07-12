import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import toast from "react-hot-toast";
import RichTextEditor from "../components/RichTextEditor";
import questionService from "../services/questionService";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const tagOptions = [
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "JWT", label: "JWT" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Socket.io", label: "Socket.io" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    if (tags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    try {
      await questionService.askQuestion({
        title,
        description,
        tags: tags.map((t) => t.value),
      });
      toast.success("Question posted successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Ask a New Question</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Short and descriptive title"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <RichTextEditor value={description} onChange={setDescription} />
        </div>

        <div>
          <label className="block font-medium">Tags</label>
          <Select
            isMulti
            options={tagOptions}
            value={tags}
            onChange={setTags}
            placeholder="Choose relevant tags"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Submit Question
        </button>
      </form>
    </div>
  );
}
