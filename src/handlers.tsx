import {OMDBResponse, CuttlyResponse} from "./types";

export const getMovieByID = async (id: string): Promise<OMDBResponse> => {
  const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${process.env.REACT_APP_OMDB_API_KEY}&type=movie`);
  const movie = await response.json();
  return new OMDBResponse(movie);
}

export const getMoviesBySearchTerm = async (searchTerm: string): Promise<OMDBResponse> => {
  const response = await fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${process.env.REACT_APP_OMDB_API_KEY}&type=movie`);
  const movies = await response.json();
  return new OMDBResponse(movies);
}

export const getShortLink = async (url: string): Promise<CuttlyResponse> => {
  const response = await fetch(`https://thingproxy.freeboard.io/fetch/https://cutt.ly/api/api.php?key=${process.env.REACT_APP_CUTTLY_API_KEY}&short=${url}`, {
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const cuttly_response = await response.json();
  return new CuttlyResponse(cuttly_response);
}