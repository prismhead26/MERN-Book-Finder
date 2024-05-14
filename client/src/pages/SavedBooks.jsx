import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// import the useQuery Hook and the useMutation Hook from Apollo Client
import { useQuery, useMutation } from '@apollo/client';
// import the GET_ME query and the REMOVE_BOOK mutation
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // use useQuery Hook to execute the GET_ME query inside the SavedBooks component
  const { loading, data } = useQuery(GET_ME);
  // use the useMutation Hook to execute the REMOVE_BOOK mutation
  const [deleteBook, { error }] = useMutation(REMOVE_BOOK);

  // extract data from the GET_ME query's response, renaming it to userData
  const userData = data?.me || {};

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // execute the REMOVE_BOOK mutation and pass the bookId as the param
      const response = await deleteBook(token, {
        variables: { bookId }
      });

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <div>Loading...
      {error && (
        <div>
          {error.message}
        </div>
      )}
    </div>;
  }

  return (
    <>
    
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
