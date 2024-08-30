import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { Spinner } from 'src/components/SmallComponents/Spinner';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { UpdateServiceInput } from 'src/gql/types';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Progress,
  Row,
  Col,
} from 'reactstrap';

const AccountDetails = observer(() => {
  const { authStore, serviceStore } = useStores();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(authStore.userData.email || '');
  const [userName, setUserName] = useState(authStore.userData.userName || '');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState(
    serviceStore.currentService?.description || ''
  );
  const [category, setCategory] = useState(
    serviceStore.currentService?.category || ''
  );
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    // Fetch the service data for the current user
    serviceStore.setCurrentService();
  }, [serviceStore]);

  useEffect(() => {
    if (
      authStore.userData.userType === 'SERVICE_USER' &&
      serviceStore.currentService
    ) {
      setDescription(serviceStore.currentService.description || '');
      setCategory(serviceStore.currentService.category || '');
      setUserName(
        serviceStore.currentService.name || authStore.userData.userName
      );
    }
  }, [authStore.userData, serviceStore.currentService]);

  const handleUpdate = async () => {
    setIsEditing(false);

    if (serviceStore.currentService) {
      const updateFields: UpdateServiceInput = {};

      if (userName !== serviceStore.currentService.name) {
        updateFields.name = userName;
      }
      if (description !== serviceStore.currentService.description) {
        updateFields.description = description;
      }
      if (image) {
        updateFields.imageBase64 = await toBase64(image);
        updateFields.imageContentType = image.type;
      }

      const updateResult = await serviceStore.updateService(
        serviceStore.currentService._id,
        updateFields
      );

      if (updateResult) {
        setSuccessMessage('Service updated successfully!');
      } else {
        setErrorMessage('Failed to update service.');
      }
    }

    if (
      email !== authStore.userData.email ||
      userName !== authStore.userData.userName
    ) {
      await authStore.updateUserDetails(
        authStore.userData._id,
        email,
        userName
      );
    }

    if (password) {
      await authStore.updatePassword(authStore.userData._id, password);
    }
  };

  const toBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadstart = () => setUploadProgress(0);
      reader.onprogress = (event) => {
        if (event.loaded && event.total) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };
      reader.onloadend = () => {
        setUploadProgress(100);
        resolve((reader.result as string).split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  if (authStore.isLoading || serviceStore.isLoading) return <Spinner />;
  if (authStore.error || serviceStore.error)
    return (
      <ErrorAlert
        errorMessage={authStore.error?.message || serviceStore.error?.message}
      />
    );

  return (
    <div className="container">
      <Label className="font-weight-bold" style={{ color: 'white' }}>
        <h2>Account Details</h2>
      </Label>
      {successMessage && <Alert color="success">{successMessage}</Alert>}

      {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
      <Form>
        <Row>
          <Col md={6}>
            <FormGroup className="mb-4">
              <Label
                for="email"
                className="font-weight-bold"
                style={{ color: 'white' }}
              >
                Email
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup className="mb-4">
              <Label
                for="userName"
                className="font-weight-bold"
                style={{ color: 'white' }}
              >
                Username
              </Label>
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={!isEditing}
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>
        {authStore.userData.userType === 'SERVICE_USER' && (
          <>
            <Row>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label
                    for="category"
                    className="font-weight-bold"
                    style={{ color: 'white' }}
                  >
                    Category
                  </Label>
                  <Input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!isEditing}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup className="mb-4">
                  <Label
                    for="description"
                    className="font-weight-bold"
                    style={{ color: 'white' }}
                  >
                    Description
                  </Label>
                  <Input
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!isEditing}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
            </Row>
            {serviceStore.currentService?.imageBase64 && (
              <div style={{ marginBottom: '10px' }}>
                <img
                  src={`data:${serviceStore.currentService.imageContentType};base64,${serviceStore.currentService.imageBase64}`}
                  alt="Current Service"
                  style={{
                    maxWidth: '100px',
                    maxHeight: '100px',
                    display: 'block',
                  }}
                />
              </div>
            )}
            <FormGroup className="mb-4">
              <Label
                for="image"
                className="font-weight-bold"
                style={{ color: 'white' }}
              >
                Upload Image
              </Label>
              <Input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="form-control"
                disabled={!isEditing}
              />
              {image && (
                <div className="mt-2">
                  <Progress value={uploadProgress}>{uploadProgress}%</Progress>
                </div>
              )}
            </FormGroup>
          </>
        )}
        <FormGroup className="mb-4">
          <Label
            for="password"
            className="font-weight-bold"
            style={{ color: 'white' }}
          >
            Change Password
          </Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!isEditing}
            className="form-control"
          />
        </FormGroup>
        <Button
          color="primary"
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'btn-danger' : ''}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
        {isEditing && (
          <Button
            color="success"
            onClick={handleUpdate}
            style={{ marginLeft: '10px' }}
          >
            Save
          </Button>
        )}
      </Form>
    </div>
  );
});

export default AccountDetails;
