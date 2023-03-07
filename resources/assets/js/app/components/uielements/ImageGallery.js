import React, { useState } from 'react';
import { Row, Col } from 'antd';
import Carousel, { Modal, ModalGateway } from 'react-images';
import styled from 'styled-components';
import ImageGalleryView from './ImageGalleryView';

type TMedia = { id: string, url: string, mimeType: string };
type Props = {
  medias: TMedia[],
  isPublicStream?: boolean,
};

const GalleryContainer = styled.div`
  text-align: center;
  margin: auto;
  width: 100%;
  overflow: hidden;
`;

const ImageGallery = ({ medias, isPublicStream }: Props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);

  const countFrom = 5;
  let mediasToShow = [];

  if (medias.length > countFrom) {
    mediasToShow = medias.slice(0, 5);
  } else {
    mediasToShow = [...medias];
  }

  const onClick = i => {
    setSelectedImage(i);
    setLightboxIsOpen(true);
  };

  return (
    <GalleryContainer>
      {mediasToShow.length === 1 &&
        renderSingleMedia(medias[0], !!isPublicStream)}
      {[3, 4].includes(mediasToShow.length) && renderOne(medias, onClick)}
      {mediasToShow.length >= 2 &&
        mediasToShow.length != 4 &&
        renderTwo(medias, onClick)}
      {mediasToShow.length >= 4 && renderThree(medias, onClick)}

      <ModalGateway>
        {lightboxIsOpen && (
          <Modal
            onClose={() => setLightboxIsOpen(false, onClick)}
            styles={{
              blanket: base => ({ ...base, zIndex: 1100 }),
              positioner: base => ({ ...base, zIndex: 1110 }),
              dialog: base => ({ ...base, zIndex: 1120 }),
            }}>
            <Carousel
              currentIndex={selectedImage}
              views={medias.map(media => {
                const isVideo =
                  media.mimeType && media.mimeType.includes('video');
                return {
                  source: {
                    regular: media.url,
                  },
                  caption: isVideo ? noSupportVideoMessage : '',
                  replyUrl: media.replyUrl,
                  isPublicStream: !!isPublicStream,
                };
              })}
              components={{ View: ImageGalleryView }}
            />
          </Modal>
        )}
      </ModalGateway>
    </GalleryContainer>
  );
};

const noSupportVideoMessage = (
  <span>
    Unfortunately we are unable to support videos due to technological
    limitations, but you can always contact the sender to have them send it to
    you directly!
  </span>
);

const StyledCol = styled(Col)`
  border: 2px solid white;
  border-radius: 4px;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  cursor: pointer;
  overflow: hidden;
`;

const HeightOneCol = styled(StyledCol)`
  width: 100%;
  padding-top: 100% !important;
`;

const HeightTwoCol = styled(StyledCol)`
  width: 50%;
  padding-top: 50% !important;
`;

const HeightThreeCol = styled(StyledCol)`
  width: 33.3333%;
  padding-top: 33.3333% !important;
`;

const Media = ({ component: Component, media, mediasPerRow, ...props }) => {
  // Filter videos
  if (media && media.mimeType && media.mimeType.includes('video')) {
    return (
      <Component {...props} style={{ background: 'rgb(241, 243, 246)' }}>
        <div
          style={{
            position: 'absolute',
            width: '75%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 6 + 8 / mediasPerRow + 'px',
          }}>
          <div style={{ marginBottom: '10px', fontWeight: 600 }}>
            Someone sent a video!
          </div>{' '}
          <div>{noSupportVideoMessage}</div>
        </div>
      </Component>
    );
  } else return <Component {...props} />;
};

const renderSingleMedia = (media: TMedia, isPublicStream: boolean) => (
  <div>
    <a href={media.replyUrl} target={isPublicStream ? '_self' : '_blank'}>
      <img src={media.url} style={{ maxWidth: '100%' }} />
    </a>
  </div>
);

const renderOne = (medias: string, onClick: (i: number) => void) => (
  <Row>
    <Media
      component={HeightOneCol}
      onClick={() => onClick(0)}
      media={medias[0]}
      style={{ background: `url(${medias[0].url})` }}
      mediasPerRow={1}
    />
  </Row>
);

const renderTwo = (medias: string, onClick: (i: number) => void) => {
  const conditionalRender = medias.length === 3;
  return (
    <Row>
      <Media
        component={HeightTwoCol}
        media={medias[conditionalRender ? 1 : 0]}
        xs={12}
        onClick={() => onClick(conditionalRender ? 1 : 0)}
        style={{ background: `url(${medias[conditionalRender ? 1 : 0].url})` }}
        mediasPerRow={2}
      />
      <Media
        component={HeightTwoCol}
        media={medias[conditionalRender ? 2 : 1]}
        xs={12}
        onClick={() => onClick(conditionalRender ? 2 : 1)}
        style={{ background: `url(${medias[conditionalRender ? 2 : 1].url})` }}
        mediasPerRow={2}
      />
    </Row>
  );
};

const renderThree = (medias: string, onClick: (i: number) => void) => {
  const overlay = medias.length > 5 ? renderCountOverlay(medias.length) : null;
  const conditionalRender = medias.length === 4;
  return (
    <Row>
      <Media
        component={HeightThreeCol}
        media={medias[conditionalRender ? 1 : 2]}
        xs={8}
        onClick={() => onClick(conditionalRender ? 1 : 2)}
        style={{ background: `url(${medias[conditionalRender ? 1 : 2].url})` }}
        mediasPerRow={3}
      />
      <Media
        component={HeightThreeCol}
        media={medias[conditionalRender ? 2 : 3]}
        xs={8}
        onClick={() => onClick(conditionalRender ? 2 : 3)}
        style={{ background: `url(${medias[conditionalRender ? 2 : 3].url})` }}
        mediasPerRow={3}
      />
      <Media
        component={HeightThreeCol}
        media={medias[conditionalRender ? 3 : 4]}
        xs={8}
        onClick={() => onClick(conditionalRender ? 3 : 4)}
        style={{ background: `url(${medias[conditionalRender ? 3 : 4].url})` }}
        mediasPerRow={3}>
        {overlay}
      </Media>
    </Row>
  );
};

const Overlay = styled.div`
  background-color: #222;
  opacity: 0.8;
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
`;

const OverlayText = styled.div`
  right: 0;
  left: 0;
  bottom: 0;
  color: white;
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
  text-align: center;

  > p {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 200%;
  }
`;

const renderCountOverlay = mediaCount => {
  const extra = mediaCount - 5;

  return [
    extra > 0 && <Overlay key="overlay" />,
    extra > 0 && (
      <OverlayText key="count-sub">
        <p>+{extra}</p>
      </OverlayText>
    ),
  ];
};

export default ImageGallery;
