import React, { useState } from 'react';
import styled from 'styled-components';
import { Upload, Icon, notification } from 'antd';
import api from '../../services/api';

function validateImage(file) {
  const formatIsAccepted =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg' ||
    file.type === 'image/gif';

  if (!formatIsAccepted) {
    notification.error({
      message: 'Sorry, this image format is not accepted.',
    });
  }
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    notification.error({ message: 'Image must be smaller than 10 MB.' });
  }
  return formatIsAccepted && isLt2M;
}

const Wrapper = styled.div`
  height: 104px;
  .image-uploader {
    height: 104px;
  }
`;

type Props = {
  eventId: string,
  form: Object,
  thumbnail: string,
};

const ImageUploader = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const uploadImage = async ({ file }) => {
    setLoading(true);
    try {
      const blob = new Blob([file], { type: file.type });
      const formData = new FormData();
      formData.append('image', blob, file.name);

      const urls = await api.uploadImage(props.eventId, formData);

      if (!urls.image || !urls.thumbnail) {
        throw Error();
      }

      props.form.setFieldsValue({
        image: urls.image,
        thumbnail: urls.thumbnail,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: 'Sorry, an error occured while uploading your image',
      });
    }
  };

  const handleRemove = () => {
    props.form.setFieldsValue({
      image: null,
      thumbnail: null,
    });
    return true;
  };

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Wrapper>
      <Upload
        name="image"
        accept=".jpeg,.jpg,.png,.gif"
        listType="picture-card"
        className="image-uploader upload-list-inline"
        fileList={
          props.thumbnail
            ? [
                {
                  uid: '-1',
                  status: 'done',
                  name: 'uploaded_image',
                  url: props.thumbnail,
                },
              ]
            : []
        }
        showUploadList={{
          showPreviewIcon: false,
          showDownloadIcon: false,
        }}
        beforeUpload={validateImage}
        customRequest={uploadImage}
        onRemove={handleRemove}>
        {!props.thumbnail && uploadButton}
      </Upload>
    </Wrapper>
  );
};

export default ImageUploader;
