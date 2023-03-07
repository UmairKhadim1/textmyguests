import React from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  display: block;
  line-height: 0;
  position: relative;
  text-align: center;
`;

const Image = styled.img`
  height: auto;
  max-height: 100vh;
  max-width: 100%;
  user-select: none;
  vertical-align: middle;
  border-style: none;
`;

type Props = {
  data: Object,
  isFullScreen: boolean,
  isModal: boolean,
};

const View: React.FC = (props: Props) => {
  const { data } = props;
  const innerProps = {
    alt: data.caption,
    src: data.source && data.source.regular ? data.source.regular : '',
  };

  return (
    <ImageContainer>
      <a href={data.replyUrl} target={data.isPublicStream ? '_self' : '_blank'}>
        <Image {...innerProps} />
      </a>
    </ImageContainer>
  );
};

export default View;
