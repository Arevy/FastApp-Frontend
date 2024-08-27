import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { Spinner } from 'src/components/SmallComponents/Spinner';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { UpdateServiceInput } from 'src/gql/types';

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

  useEffect(() => {
    // Fetch the services if they haven't been fetched yet
    if (!serviceStore.services.length) {
      serviceStore.setCurrentService();
    }
  }, [serviceStore, serviceStore.services.length]);

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

      if (Object.keys(updateFields).length > 0) {
        await serviceStore.updateService(
          serviceStore.currentService._id, // Folosește currentService._id
          updateFields
        );
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
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
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
      <h2>Account Details</h2>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          className="form-control"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={!isEditing}
        />
      </div>
      {authStore.userData.userType === 'SERVICE_USER' && (
        <>
          <div className="form-group">
            <label>Category</label>
            <input
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              disabled={!isEditing}
            />
          </div>
        </>
      )}
      <div className="form-group">
        <label>Change Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={!isEditing}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
      {isEditing && (
        <button className="btn btn-success" onClick={handleUpdate}>
          Save
        </button>
      )}
    </div>
  );
});

export default AccountDetails;
