import React, { useState, useEffect, useCallback } from 'react';
import '@shopify/polaris/dist/styles.css';
import { Movie } from '../types';
import { Modal, Stack, TextContainer, TextField, Spinner } from '@shopify/polaris';
import { getShortLink } from '../handlers';

interface ShareModalProps {
  nominations: Movie[],
  open: boolean,
  toggleModal: () => void
}

export default function ShareModal ({nominations, open, toggleModal}: ShareModalProps) {
  const [loading, setLoading] = useState(true);
  const [shortLink, setShortLink] = useState("");
  
  const nominationsToString = useCallback(() => {
    return nominations.map((nomination: Movie) => nomination.imdbID).join();
  }, [nominations])
  
  useEffect(() => {
    const nested = async () => {
      const response = await getShortLink(`${window.location.href}list/${nominationsToString()}`);
      setShortLink(response.shortlink);
      setLoading(false);
    }
    if(open){
      nested();
    }
  }, [nominations, nominationsToString, open])
  

  return (
    <Modal
      open={open}
      onClose={() => toggleModal()}
      title="Share your nominations"
    >
      <Modal.Section>
        <Stack vertical>
          <Stack.Item>
            <TextContainer>
              <p>Share your link with your friends to show them which movies you believe should be nominated for the Shoppies!</p>
            </TextContainer>
          </Stack.Item>
          <Stack.Item fill>
            {loading ? <Spinner /> : <TextField
              readOnly={true}
              label="Your link"
              value={shortLink}
              onChange={() => {}}
            />}
          </Stack.Item>
        </Stack>
      </Modal.Section>
    </Modal>
  );

}