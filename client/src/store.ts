// src/store.ts
import { create } from "zustand";

export type Book = {
    key: string;
    title: string;
    first_publish_year?: number;
    language?: string[];
    number_of_pages_median?: number;
    author_name?: string[];
    subject?: string[];
    status: "done" | "inProgress" | "backlog";
    imageUrl?: string; 
    description?: string; 
    workId?: string; 
  };
  

interface BookState {
  books: Book[];
}

interface BookStore extends BookState {
  addBook: (newBook: Book) => void;
  removeBook: (bookToRemove: Book) => void;
  moveBook: (bookToMove: Book, newStatus: Book["status"]) => void;
  loadBooksFromLocalStorage: () => void;
  reorderBooks: (listType: Book["status"], startIndex: number, endIndex: number) => void;
}

const useStore = create<BookStore>((set) => ({
  books: [],

  loadBooksFromLocalStorage: () => {
    const storedBooks = localStorage.getItem("readingList");
    if (storedBooks) {
      set({ books: JSON.parse(storedBooks) });
    }
  },

  addBook: (newBook) =>
    set((state) => {
      const updatedBooks: Book[] = [
        ...state.books,
        {
          ...newBook,
          status: "backlog",
        },
      ];
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  removeBook: (bookToRemove) =>
    set((state) => {
      const updatedBooks = state.books.filter(
        (book) => book.key !== bookToRemove.key
      );
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  moveBook: (bookToMove, newStatus) =>
    set((state) => {
      const updatedBooks = state.books.map((book) =>
        book.key === bookToMove.key ? { ...book, status: newStatus } : book
      );
      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),

  reorderBooks: (listType, startIndex, endIndex) =>
    set((state) => {
      const filteredBooks = state.books.filter(book => book.status === listType);

      const [reorderedBook] = filteredBooks.splice(startIndex, 1);
      filteredBooks.splice(endIndex, 0, reorderedBook);

      const updatedBooks = state.books.map((book) =>
        book.status === listType ? filteredBooks.shift() || book : book
      );

      localStorage.setItem("readingList", JSON.stringify(updatedBooks));
      return { books: updatedBooks };
    }),
}));

export default useStore;
