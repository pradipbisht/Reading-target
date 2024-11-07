import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { Book } from "../store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'react-toastify';

export type SearchResult = {
  docs: Book[];
  numFound: number;
};

const BookSearch = ({ onAddBook }: { onAddBook: (book: Book) => void }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string>(''); // State for success message
  const resultsPerPage = 80;

  const searchBooks = async (page: number = 1) => {
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await axios.get<SearchResult>(`https://openlibrary.org/search.json?q=${query}&page=${page}&limit=${resultsPerPage}`);
      setResults(response.data.docs);
      setTotalResults(response.data.numFound);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchBooks();
    }
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      searchBooks(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < Math.ceil(totalResults / resultsPerPage)) {
      searchBooks(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(startIndex + resultsPerPage - 1, totalResults);

  const handleAddBook = (book: Book) => {
    onAddBook(book); 
    setSuccessMessage(`"${book.title}" has been added to your list!`);

    toast.success(`"${book.title}" has been added to your list!`);

    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Title section */}
      <div className="flex justify-between items-center mb-6">
        <div className="sm:max-w-md w-full">
          <Input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            onKeyUp={handleKeyPress} 
            placeholder="Search for a book" 
            className="p-3 text-lg border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end w-full text-right">
          <h1 className="text-3xl font-bold text-gray-800 hover:text-amber-500 uppercase">Target List_reading </h1>
        </div>
      </div>

      {/* Search Button */}
      <Button 
        onClick={() => searchBooks()} 
        disabled={isLoading} 
        className="w-full sm:w-auto mb-4 flex justify-center items-center gap-2"
      >
        {isLoading ? <span>Searching...</span> : <><Search className="w-5 h-5" /> Search</>}
      </Button>
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Search Results */}
      <div className="overflow-auto mb-4 max-h-64">
        {query.length > 0 && results.length > 0 ? (
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="p-3 text-left">Title</TableHead>
                <TableHead className="p-3 text-left">Year</TableHead>
                <TableHead className="p-3 text-left">Language</TableHead>
                <TableHead className="p-3 text-left">Page Count</TableHead>
                <TableHead className="p-3 text-center">Add</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((book, index) => (
                <TableRow key={`${book.key}-${index}`}>
                  <TableCell className="p-3">{book.title}</TableCell>
                  <TableCell className="p-3">{book.first_publish_year}</TableCell>
                  <TableCell className="p-3">{book.language?.join(", ")}</TableCell>
                  <TableCell className="p-3">{book.number_of_pages_median}</TableCell>
                  <TableCell className="p-3 text-center">
                    <Button 
                      onClick={() => handleAddBook(book)} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center p-8 text-gray-500">
            <p>Start your search...</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <Button 
          variant="outline" 
          onClick={handlePreviousClick} 
          disabled={currentPage <= 1} 
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>
        <span>{`Showing ${startIndex} - ${endIndex} of ${totalResults} results`}</span>
        <Button 
          variant="outline" 
          onClick={handleNextClick} 
          disabled={endIndex >= totalResults} 
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default BookSearch;
