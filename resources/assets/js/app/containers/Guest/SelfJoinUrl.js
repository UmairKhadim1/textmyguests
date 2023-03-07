import React, { useRef } from 'react';
import styled from 'styled-components';
import { siteConfig } from '../../config';
import HelpTooltip from '../../components/uielements/HelpTooltip';
import notification from '../../components/feedback/notification';

const UrlContainer = styled.div`
  display: flex;
  align-items: center;

  a {
    font-weight: 600;
    margin-left: 0.4rem;

    &:hover {
      text-decoration: underline;
    }
  }

  .icon {
    margin-left: 0.5rem;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
  }

  .full-join-url {
    display: none;
  }
`;

type Props = {
  eventId: string,
};

const SelfJoinUrl: React.FC = (props: Props) => {
  const urlRef = useRef(null);
  const url = siteConfig.shortUrl + `/${props.eventId}/join`;

  const handleClick = () => {
    const copyUrl = urlRef.current;
    copyUrl.style.display = 'block';
    copyUrl.focus();
    copyUrl.select();

    try {
      const successful = document.execCommand('copy');

      if (!successful) {
        throw Error();
      }

      notification.success({ message: 'Address copied to clipboard' });
    } catch (err) {
      notification.error({ message: 'Oops, unable to copy' });
    }
    copyUrl.style.display = 'none';
  };

  return (
    <UrlContainer>
      <HelpTooltip title="You can share this URL to let your guests add themselves to your event." />
      <a href={url} target="_blank">
        tmg.link/
        {props.eventId}
        /join
      </a>
      <textarea ref={urlRef} className="full-join-url" value={url}>
        {url}
      </textarea>
      <i
        className="ion-ios-copy-outline icon"
        onClick={handleClick}
        title="Copy address to clipboard"
      />
    </UrlContainer>
  );
};

export default SelfJoinUrl;
