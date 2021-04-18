import React, {useState, useEffect} from 'react';
import '@shopify/polaris/dist/styles.css';
import {
  Button,
  Layout,
  Page,
} from '@shopify/polaris';
import { Movie, MovieListType } from '../types';
import { useParams, useHistory } from 'react-router-dom';
import MovieList from '../MovieList';
import { getMovieByID } from '../handlers';

interface SharedListProps {
  username: string,
  nominations: string
}

interface ParamType {
  nominations: string
}

export default function SharedList({username, nominations}: SharedListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  
  const params = useParams<ParamType>();
  
  const history = useHistory();
  
  useEffect(() => {
    Promise.all(getMovies()).then((response) => {
        setIsLoading(false);
        setMovies(response.filter((movie) => movie && movie.response))
      }
    );   
  })
  
  const getMovies = () => {
      const ids = params.nominations.split(",");
      return ids.map(async (id) => {
        const response = await getMovieByID(id);
        return response.movies[0];
      });
  }


  return (
    <Page
      breadcrumbs={[{content: "Create your own list", onAction: () => history.push("/") }]}
      primaryAction={<Button primary onClick={() => window.print()}>Print</Button>}
    >
      <Layout>
        <Layout.Section>
          <MovieList
            title="Nominations"
            type={MovieListType.nominations}
            readOnly={true}
            isLoading={isLoading}
            movies={movies}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}