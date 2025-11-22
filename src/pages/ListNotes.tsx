import { useNavigate } from "react-router";

export default function ListNotes() {
  const navigate = useNavigate();
  return (
    <main>
      <button>Create a new note</button>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </button>
    </main>
  );
}
