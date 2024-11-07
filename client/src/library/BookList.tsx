import { Button } from "@/components/ui/button";
import { Book } from "../store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { FaFire, FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify"; 

interface BookListProps {
  books: Book[];
  onMoveBook: (book: Book, targetList: Book["status"]) => void;
  onRemoveBook: (book: Book) => void;
}

const BookList = ({ books, onMoveBook, onRemoveBook }: BookListProps) => {
  
  const handleRemoveBook = (book: Book) => {
    onRemoveBook(book);
    toast.success(`Successfully removed "${book.title}"`); 
  };

  const handleMoveBook = (book: Book, status: Book["status"]) => {
    onMoveBook(book, status);
    toast.success(`Successfully moved "${book.title}" to ${status}`); 
  };

  const renderBookItem = (book: Book, index: number, listType: string) => (
    <Card key={`${book.title}-${index}`} className="p-4 shadow-md rounded-md bg-white">
      <CardHeader className="mb-3">
        <CardTitle className="text-lg font-semibold">{book.title}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {book.first_publish_year ? `Published in ${book.first_publish_year}` : "Year not available"}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <Button
          variant="destructive"
          onClick={() => handleRemoveBook(book)}
          className="text-red-600 hover:bg-red-100"
        >
          <FaFire className="text-lg" />
        </Button>
        <div className="inline-flex gap-3">
          <Button
            variant="outline"
            disabled={listType === "inProgress"}
            onClick={() => handleMoveBook(book, "inProgress")}
            className="flex items-center gap-2"
          >
            <FaArrowRight className="text-blue-500" />
            In Progress
          </Button>
          <Button
            variant="outline"
            disabled={listType === "backlog"}
            onClick={() => handleMoveBook(book, "backlog")}
            className="flex items-center gap-2"
          >
            <FaArrowLeft className="text-yellow-500" />
            Backlog
          </Button>
          <Button
            variant="outline"
            disabled={listType === "done"}
            onClick={() => handleMoveBook(book, "done")}
            className="flex items-center gap-2"
          >
            <FaCheckCircle className="text-green-500" />
            Done
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-8 p-4">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Book List</h2>
      {["inProgress", "backlog", "done"].map((status) => (
        <div key={status} className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </h3>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {books
              .filter((book) => book.status === status)
              .map((book, index) => renderBookItem(book, index, status))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
