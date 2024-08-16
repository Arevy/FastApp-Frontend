import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

interface CreateServiceFormProps {
  onClose?: () => void;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = observer(
  ({ onClose }) => {
    const { serviceStore } = useStores();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

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

              // După ce imaginea este încărcată, se face apelul pentru a crea serviciul
              serviceStore
                .createService({
                  name,
                  category,
                  isActive,
                  description,
                  imageBase64,
                  imageContentType,
                })
                .then(() => {
                  serviceStore.fetchServices(); // Fetch services after creating a new one
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
          });

          await serviceStore.fetchServices(); // Fetch services after creating a new one
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
