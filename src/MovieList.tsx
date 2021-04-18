import React from 'react';
import '@shopify/polaris/dist/styles.css';
import './App.scss';
import {
  Card,
  ResourceList,
  ResourceItem,
  Stack,
  TextStyle,
  Caption,
  Button,
  Avatar,
} from '@shopify/polaris';
import { ButtonType, Movie, MovieListType } from './types';
import notfound from './assets/image-not-found.svg';

interface MovieListProps {
  title: string,
  type: MovieListType,
  placeholder?: string,
  errorMessage?: string,
  movies: Movie[],
  isLoading: boolean,
  readOnly?: boolean,
  onEdit?: (movie: Movie) => void
  canEdit?: (movie: Movie) => boolean
}

export default function MovieList({
  title,
  type,
  placeholder="",
  errorMessage,
  movies,
  isLoading,
  readOnly=false,
  onEdit=(movie: Movie) => {},
  canEdit=(movie: Movie) => false,
}: MovieListProps) {

  const renderIMDbButton = (movie: Movie) => {
    return (
      <Button external url={`https://imdb.com/title/${movie.imdbID}`}>
        View on IMDb
      </Button>
    );
  }

  const renderActionButton = (movie: Movie) => {
    const buttonText = type === MovieListType.nominations ? "Remove" : "Nominate";
    const buttonType = type === MovieListType.nominations ? ButtonType.destructive : ButtonType.primary;
    const disabled = canEdit(movie);

    return (
      !readOnly &&
      <Button
        primary={buttonType === ButtonType.primary}
        destructive={buttonType === ButtonType.destructive}
        disabled={disabled}
        onClick={() => onEdit(movie)}
      >
        {buttonText}
      </Button>
    );
  }

  const renderMovie = (movie: Movie) => {
    const { imdbID, title, year, poster } = movie;

    return (
      <ResourceItem
        id={imdbID}
        onClick={() => {}}
        accessibilityLabel={`${title} (${year})`}
        name={`${title} (${year})`}
        children={
          <Stack vertical>
            <Stack>
              <Avatar source={poster || notfound} size="large" customer={false}/>
              <Stack vertical>
                <TextStyle variation="strong">
                  {title}
                  <Caption>{year}</Caption>
                </TextStyle>
              </Stack>
            </Stack>
            <Stack distribution="trailing">
              {renderIMDbButton(movie)}
              {renderActionButton(movie)}
            </Stack>
          </Stack>
        }
      />
    );
  }

  return (
    <Card
      sectioned={movies.length <= 0}
      title={title}
    >
      <ResourceList
        emptyState={placeholder}
        loading={isLoading}
        items={movies}
        renderItem={(movie) => renderMovie(movie)}
      />
    </Card>
  )
}
