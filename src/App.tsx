import React, {Suspense, useState, useEffect, useCallback} from 'react';
import '@shopify/polaris/dist/styles.css';
import './App.scss';
import {
  Thumbnail,
  Banner,
  Button,
  Layout,
  Page,
  Spinner,
  Stack,
  Tooltip,
} from '@shopify/polaris';
import {Movie, MovieListType, OMDBErrors} from './types';
import MovieList from './MovieList';
import SearchBar from './SearchBar/SearchBar';
import {getMoviesBySearchTerm} from './handlers';
import trophy from './assets/trophy.svg';

function App() {

  const readNominationsFromLocalStorage = () => {
    return localStorage.getItem("nominations") ? JSON.parse(localStorage.getItem("nominations") || "") : [];
  }

  
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [nominations, setNominations] = useState(readNominationsFromLocalStorage());
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const handleAddNomination = (nomination: Movie) => {
    setNominations([...nominations, nomination])
  }
  

  const updateLocalStorage = useCallback((nominations) => {
    nominations.length > 0
      ? localStorage.setItem("nominations", JSON.stringify(nominations))
      : localStorage.clear()
  }, []); 

  const handleRemoveNomination = (nomination: Movie) => {
    setNominations(nominations.filter((m: Movie) => {return m.title !== nomination.title}));
  }

  const checkNominated = (nomination: Movie) => {
    return nominations.includes(nomination);
  }

  const handleSearchValueChange = async (searchValue: string) => {
    setIsLoading(true);
    setSearchValue(searchValue);

    if (!searchValue) {
      setIsLoading(false);
      setMovies([])
      return;
    }

    const response = await getMoviesBySearchTerm(searchValue);

    setIsLoading(false);
    setErrorMessage(response.error);
    setMovies(response.movies);
  }

  const clear = () => {
    setIsLoading(false);
    setSearchValue("");
    setMovies([]);
    setNominations([]);
    setErrorMessage("");
    setShareModalOpen(false);
  }
  
  
  const toggleModal = () => {
    setShareModalOpen(!shareModalOpen);
  }
  
  useEffect(() => {
    updateLocalStorage(nominations);
  }, [nominations, updateLocalStorage])
  
    const noNominations = "You haven't nominated any movies yet.";
    const noResults = "Couldn't find any movies with that name. Try with another one.";
    const tooManyResults = "Too many results found with that name. Try being more specific.";
    const emptySearch = "Use the search bar above to find your favorite movies and nominate them.";

    const ShareModal = React.lazy(() => import("./ShareModal/ShareModal"));

    const shareButton = (
      <Button
        primary
        disabled={nominations.length < 5}
        onClick={() => setShareModalOpen(true)}
        children={"Share"}
      />
    )

  return (
    <Page  
      thumbnail={<Thumbnail source={trophy} size="small" alt="trophy icon" />}
      title="The Shoppies"
      primaryAction={
        <Stack>
          <Button
            disabled={nominations.length <= 0 && !searchValue}
            onClick={clear}
          >
            Clear
          </Button>
          {
            nominations.length < 5 &&
            <Tooltip content={<>Before sharing, you must select your <b>five</b> nominations.</>}>
              {shareButton}
            </Tooltip>
          }
          {nominations.length === 5 && shareButton}
          
        </Stack>
      }
    >
      <Suspense fallback={<Spinner/>}>
        <ShareModal
          open={shareModalOpen}
          nominations={nominations}
          toggleModal={toggleModal}
        />
      </Suspense>
      <Layout>
        {
          nominations.length === 5 &&
          <Layout.Section>
            <Banner title="You did it!" status="success" onDismiss={() => {}}>
              <p>You have successfully picked your five nominations for the Shoppies.</p>
            </Banner>
          </Layout.Section>
        }
        
        <Layout.Section>
          <SearchBar
            searchValue={searchValue}
            onSearchValueChange={handleSearchValueChange}
          />
        </Layout.Section>
        <Layout.Section oneHalf>
          <MovieList
            title={!searchValue? "Results" : `Results for "${searchValue}"`}
            type={MovieListType.search}
            placeholder={!searchValue? emptySearch : errorMessage === OMDBErrors.noResults ? noResults : tooManyResults}
            errorMessage={errorMessage}
            isLoading={isLoading}
            movies={movies}
            onEdit={handleAddNomination}
            canEdit={nominations.length < 5 ? checkNominated : () => true}
          />
        </Layout.Section>
        <Layout.Section oneHalf>
        <MovieList
          title="Nominations"
          type={MovieListType.nominations}
          placeholder={noNominations}
          isLoading={isLoading}
          movies={nominations}
          onEdit={handleRemoveNomination}
        />
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default App;
