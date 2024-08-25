import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
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

interface RegisterServiceFormProps {
  onClose?: () => void;
}

const RegisterServiceForm: React.FC<RegisterServiceFormProps> = observer(
  ({ onClose }) => {
    const { serviceStore, authStore } = useStores();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        let imageBase64 = '';
        let imageContentType = '';

        if (imageFile) {
          const reader = new FileReader();

          reader.onloadend = () => {
            if (reader.result) {
              imageBase64 = (reader.result as string).split(',')[1];
              imageContentType = imageFile.type;

              serviceStore
                .createService({
                  name,
                  category,
                  description,
                  isActive: true,
                  imageBase64,
                  imageContentType,
                })
                .then(() => {
                  return authStore.registerUser(
                    email,
                    password,
                    'SERVICE_USER',
                    userName
                  );
                })
                .then(() => {
                  return authStore.loginUser(email, password, 'SERVICE');
                })
                .then(() => {
                  serviceStore.fetchServices();
                  if (onClose) {
                    onClose();
                  }
                })
                .catch((err) => {
                  console.error('Error during service creation:', err);
                  setError('Failed to create service. Please try again.');
                })
                .finally(() => setIsSubmitting(false));
            } else {
              setError('Failed to load image.');
              setIsSubmitting(false);
            }
          };

          reader.onerror = (error) => {
            console.error('Error reading image file:', error);
            setError('Error reading image file.');
            setIsSubmitting(false);
          };

          reader.readAsDataURL(imageFile);
        } else {
          serviceStore
            .createService({
              name,
              category,
              description,
              isActive: true,
              imageBase64,
              imageContentType,
            })
            .then(() => {
              return authStore.registerUser(
                email,
                password,
                'SERVICE',
                userName
              );
            })
            .then(() => {
              return authStore.loginUser(email, password, 'SERVICE');
            })
            .then(() => {
              serviceStore.fetchServices();
              if (onClose) {
                onClose();
              }
            })
            .catch((err) => {
              console.error('Error during service creation:', err);
              setError('Failed to create service. Please try again.');
            })
            .finally(() => setIsSubmitting(false));
        }
      } catch (err) {
        console.error('Error during service creation:', err);
        setError('Failed to create service. Please try again.');
        setIsSubmitting(false);
      }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        setImageFile(file);
        setUploadProgress(0); // Reset progress bar

        const reader = new FileReader();
        reader.onloadstart = () => setUploadProgress(0);
        reader.onprogress = (event) => {
          if (event.loaded && event.total) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };
        reader.onloadend = () => setUploadProgress(100);
        reader.readAsDataURL(file);
      }
    };

    return (
      <Form onSubmit={handleSubmit} className="text-light">
        {error && <Alert color="danger">{error}</Alert>}
        <Row>
          <Col md={6}>
            <FormGroup className="mb-4">
              <Label for="name" className="font-weight-bold">
                Service Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup className="mb-4">
              <Label for="category" className="font-weight-bold">
                Category
              </Label>
              <Input
                type="text"
                name="category"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup className="mb-4">
          <Label for="description" className="font-weight-bold">
            Description
          </Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
        </FormGroup>
        <FormGroup className="mb-4">
          <Label for="image" className="font-weight-bold">
            Upload Image
          </Label>
          <Input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="form-control"
          />
          {imageFile && (
            <div className="mt-2">
              <Progress value={uploadProgress}>{uploadProgress}%</Progress>
            </div>
          )}
        </FormGroup>
        <Row>
          <Col md={6}>
            <FormGroup className="mb-4">
              <Label for="email" className="font-weight-bold">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup className="mb-4">
              <Label for="userName" className="font-weight-bold">
                Username
              </Label>
              <Input
                type="text"
                name="userName"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup className="mb-4">
              <Label for="password" className="font-weight-bold">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup className="mb-4">
              <Label for="repeatPassword" className="font-weight-bold">
                Repeat Password
              </Label>
              <Input
                type="password"
                name="repeatPassword"
                id="repeatPassword"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
                className="form-control"
              />
            </FormGroup>
          </Col>
        </Row>
        <Button
          color="primary"
          type="submit"
          disabled={isSubmitting}
          className={isSubmitting ? 'disabled' : ''}
        >
          {isSubmitting ? 'Creating...' : 'Create Service'}
        </Button>
      </Form>
    );
  }
);

export default RegisterServiceForm;
