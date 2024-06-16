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
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        await serviceStore.createService(name, category, isActive);
        await serviceStore.fetchServices(); // Fetch services after creating a new one
        if (onClose) {
          onClose();
        }
      } catch (err) {
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
