import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

interface CreateUserFormProps {
  onClose?: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = observer(({ onClose }) => {
  const { userStore } = useStores();
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('NORMAL_USER');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await userStore.createUser(email, userName, password, userType, isActive);
      await userStore.fetchUsers(); // Refresh the list of users after creating a new one
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError('Failed to create user. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert color="danger">{error}</Alert>}
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="userName">Username</Label>
        <Input
          type="text"
          name="userName"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="confirmPassword">Confirm Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <Label for="userType">User Type</Label>
        <Input
          type="select"
          name="userType"
          id="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="NORMAL_USER">Normal User</option>
          <option value="SERVICE_USER">Service User</option>
          <option value="ADMIN_USER">Admin User</option>
        </Input>
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
});

export default CreateUserForm;
