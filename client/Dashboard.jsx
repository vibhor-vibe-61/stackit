import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import questionService from "../services/questionService";

export default function Dashboard() {
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  useEffect(() => {
    questionService.getAll().then((res) => setQuestions(res.data));
    questionService.getTags().then((res) => {
      const tagOptions = res.data.map((tag) => ({
        label: tag.name,
        value: tag.name,
      }));
      setAvailableTags(tagOptions);
    });
  }, []);

  // Filter logic
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => q.tags.includes(tag.value));

    return matchesSearch && matchesTags;
  });

  // Pagination logic
  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📚 Browse Questions</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          className="w-full md:w-1/2 border px-3 py-2 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          isMulti
          options={availableTags}
          value={selectedTags}
          onChange={setSelectedTags}
          placeholder="Filter by tags"
          className="md:w-1/2"
        />
      </div>

      <div className="space-y-4">
        {currentQuestions.map((q) => (
          <div key={q._id} className="bg-white p-4 rounded shadow">
            <Link to={`/question/${q._id}`} className="text-lg font-semibold text-blue-600">
              {q.title}
            </Link>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{q.description}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {q.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === num + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
