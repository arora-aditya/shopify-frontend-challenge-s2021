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
  const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_LS_API_KEY}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "long_url": url, "domain": "bit.ly" })
  });

  const cuttly_response = await response.json();
  return new CuttlyResponse(cuttly_response);
}