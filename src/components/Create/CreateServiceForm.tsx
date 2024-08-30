import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

interface CreateServiceFormProps {
  onClose?: () => void;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = observer(
  ({ onClose }) => {
    const { serviceStore, userStore, authStore } = useStores();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    useEffect(() => {
      if (authStore.userData.userType === 'ADMIN_USER') {
        userStore.fetchUsers();
      } else if (authStore.userData.userType === 'NORMAL_USER') {
        setSelectedUserId(authStore.userData._id);
      }
    }, [authStore.userData.userType, userStore, authStore.userData._id]);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      console.log('Submit initiated');

      try {
        let imageBase64 = '';
        let imageContentType = '';

        if (imageFile) {
          console.log('Image file detected:', imageFile);
          const reader = new FileReader();

          reader.onloadend = () => {
            if (reader.result) {
              console.log('Image read operation finished');
              imageBase64 = (reader.result as string).split(',')[1]; // Elimină prefixul `data:image/png;base64,`
              imageContentType = imageFile.type;

              console.log(
                'Image loaded successfully',
                imageBase64,
                imageContentType
              );

              serviceStore
                .createService({
                  name,
                  category,
                  isActive,
                  description,
                  imageBase64,
                  imageContentType,
                  userId: selectedUserId || authStore.userData._id,
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
                });
            } else {
              console.log('Failed to load image');
              setError('Failed to load image.');
            }
          };

          reader.onerror = (error) => {
            console.error('Error reading image file:', error);
            setError('Error reading image file.');
          };

          reader.readAsDataURL(imageFile);
        } else {
          console.log('No image file detected, proceeding without image');

          await serviceStore.createService({
            name,
            category,
            isActive,
            description,
            imageBase64,
            imageContentType,
            userId: selectedUserId || authStore.userData._id, // Folosim userId selectat sau pe cel al utilizatorului curent
          });

          await serviceStore.fetchServices();
          if (onClose) {
            onClose();
          }
        }
      } catch (err) {
        console.error('Error during service creation:', err);
        setError('Failed to create service. Please try again.');
      }
    };

    return (
      <Form onSubmit={handleSubmit}>
        {error && <Alert color="danger">{error}</Alert>}
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="category">Category</Label>
          <Input
            type="text"
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="image">Upload Image</Label>
          <Input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={(e) =>
              setImageFile(e.target.files ? e.target.files[0] : null)
            }
          />
        </FormGroup>
        {authStore.userData.userType === 'ADMIN_USER' ? (
          <FormGroup>
            <Label for="user">Assign to User</Label>
            <Input
              type="select"
              name="user"
              id="user"
              value={selectedUserId || ''}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a user
              </option>
              {userStore.users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.email}
                </option>
              ))}
            </Input>
          </FormGroup>
        ) : (
          <FormGroup>
            <Label for="userEmail">User Email</Label>
            <Input
              type="text"
              name="userEmail"
              id="userEmail"
              value={authStore.userData.email}
              disabled
            />
          </FormGroup>
        )}
        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </Label>
        </FormGroup>
        <Button color="primary" type="submit">
          Create
        </Button>
      </Form>
    );
  }
);

export default CreateServiceForm;
