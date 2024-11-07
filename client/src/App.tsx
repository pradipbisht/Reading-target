import { useEffect } from "react";
import BookSearch from "./library/BookSearch";
import BookList from "./library/BookList";
import useStore from "./store";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const App = () => {
  const { books, addBook, removeBook, moveBook, loadBooksFromLocalStorage } = useStore();

  useEffect(() => {
    loadBooksFromLocalStorage();
  }, [loadBooksFromLocalStorage]);

  return (
    <div className="mx-auto container">
      <BookSearch onAddBook={addBook} />
      <BookList
        books={books}
        onMoveBook={moveBook}
        onRemoveBook={removeBook}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;
