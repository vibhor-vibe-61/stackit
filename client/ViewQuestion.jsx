import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import RichTextEditor from "../components/RichTextEditor";
import questionService from "../services/questionService";

export default function ViewQuestion() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  const fetchQuestion = async () => {
    const res = await questionService.getById(id);
    setQuestion(res.data);
    setAnswers(res.data.answers);
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer || newAnswer.length < 10) {
      toast.error("Answer must be at least 10 characters long");
      return;
    }

    try {
      await questionService.postAnswer(id, { content: newAnswer });
      await fetchQuestion();
      setNewAnswer("");
      toast.success("Answer posted!");
    } catch (err) {
      toast.error("Failed to post answer");
    }
  };

  const handleVote = async (answerId, type) => {
    try {
      await questionService.voteAnswer(id, answerId, type);
      await fetchQuestion();
    } catch {
      toast.error("Voting failed");
    }
  };

  const handleAccept = async (answerId) => {
    try {
      await questionService.acceptAnswer(id, answerId);
      await fetchQuestion();
    } catch {
      toast.error("Could not accept answer");
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: question.description }}
      />
      <div className="flex gap-2 mt-3 flex-wrap">
        {question.tags.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <hr className="my-6" />

      <h2 className="text-xl font-semibold mb-4">Answers</h2>
      <div className="space-y-4">
        {answers.map((a) => (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: a.content }}
            />
            <div className="mt-3 flex gap-4 text-sm text-gray-500">
              <button onClick={() => handleVote(a._id, "up")}>👍 {a.upvotes}</button>
              <button onClick={() => handleVote(a._id, "down")}>👎 {a.downvotes}</button>
              {!a.isAccepted && (
                <button
                  onClick={() => handleAccept(a._id)}
                  className="text-green-600 font-medium"
                >
                  ✅ Accept Answer
                </button>
              )}
              {a.isAccepted && (
                <span className="text-green-600 font-bold">✔ Accepted</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAnswerSubmit} className="mt-10 space-y-4">
        <h3 className="text-lg font-semibold">Your Answer</h3>
        <RichTextEditor value={newAnswer} onChange={setNewAnswer} />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Submit Answer
        </button>
      </form>
    </div>
  );
}
