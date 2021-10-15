import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);

  const transformMovies = (movieData) => ({
    id: movieData.episode_id,
    title: movieData.title,
    openingText: movieData.opening_crawl,
    releaseDate: movieData.release_date,
  });

  const url =
    'https://react-http-7aca5-default-rtdb.firebaseio.com/movies.json';

  const fetchMovieHandler = useCallback(async () => {
    setIsloading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Sth went wrong! ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      const transformedMovies = data.results.map(transformMovies);
      setMovies(transformedMovies);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsloading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  const addMovieHandler = async (movie) => {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log(data);
  };

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
