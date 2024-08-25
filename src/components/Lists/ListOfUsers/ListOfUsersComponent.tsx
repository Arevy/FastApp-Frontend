import React, { useState } from 'react';
import { FormGroup, Input, Label, Container, Row, Col } from 'reactstrap';
import { parseUnixTimestamp } from 'src/utils/utils';
import { IUser, UserType, UserTypeLabels } from 'src/gql/types';
import { EmojiGreenCheck } from 'src/components/SmallComponents/EmojiGreenCheck';
import { EmojiRedCross } from 'src/components/SmallComponents/EmojiRedCross';

interface ListOfUsersProps {
  users: IUser[];
  updateUserAdminStatus: (
    _id: string,
    isAdmin: boolean,
    isActive: boolean,
    userType: UserType
  ) => void;
}

const ListOfUsers: React.FC<ListOfUsersProps> = ({
  users,
  updateUserAdminStatus,
}) => {
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<UserType | ''>('');
  const [mainSelectedType, setMaiSelectedType] = useState<UserType | ''>(
    selectedType
  );
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.userName &&
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = mainSelectedType
      ? user.userType === mainSelectedType
      : true;
    return matchesSearch && matchesType;
  });

  return (
    <Container className="my-4 py-4">
      <Row className="justify-content-center mb-4">
        <Col
          md={10}
          className="d-flex justify-content-between align-items-center"
        >
          <FormGroup className="w-50">
            <Label for="search" className="text-light">
              Search Users
            </Label>
            <Input
              type="text"
              name="search"
              id="search"
              placeholder="Search by email or username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="w-50 ml-3">
            <Label for="userType" className="text-light form-label w-100">
              Filter by User Type
            </Label>
            <Input
              type="select"
              name="userType"
              id="userType"
              value={mainSelectedType}
              onChange={(e) =>
                setMaiSelectedType(e.target.value as UserType | '')
              }
            >
              <option value="">All User Types</option>
              {Object.values(UserType).map((type) => (
                <option key={type} value={type}>
                  {UserTypeLabels[type]}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col>
          <table className="table text-light table-striped ">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Username</th>
                <th scope="col">Is administrator?</th>
                <th scope="col">Is active?</th>
                <th scope="col">Registration date</th>
                <th scope="col">Last login</th>
                <th scope="col">User Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.email}</td>
                  <td>{user.userName || 'No Username'}</td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      updateUserAdminStatus(
                        user._id,
                        !user.isAdmin,
                        user.isActive,
                        user.userType
                      )
                    }
                  >
                    {user.isAdmin ? <EmojiGreenCheck /> : <EmojiRedCross />}{' '}
                  </td>
                  <td
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      updateUserAdminStatus(
                        user._id,
                        user.isAdmin,
                        !user.isActive,
                        user.userType
                      )
                    }
                  >
                    {user.isActive ? <EmojiGreenCheck /> : <EmojiRedCross />}{' '}
                  </td>
                  <td>{parseUnixTimestamp(user.registrationDate)}</td>
                  <td>{parseUnixTimestamp(user.lastLogin)}</td>
                  <td style={{ cursor: 'pointer' }}>
                    {editing === user._id ? (
                      <select
                        value={selectedType}
                        onChange={(e) =>
                          setSelectedType(e.target.value as UserType)
                        }
                        onBlur={() => {
                          if (selectedType) {
                            updateUserAdminStatus(
                              user._id,
                              selectedType === UserType.ADMIN_USER,
                              user.isActive,
                              selectedType
                            );
                          }
                          setEditing(null); // Stop editing after selection
                        }}
                      >
                        {Object.values(UserType).map((type) => (
                          <option key={type} value={type}>
                            {UserTypeLabels[type]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        onClick={() => {
                          setEditing(user._id);
                          setSelectedType(user.userType);
                        }}
                      >
                        {UserTypeLabels[user.userType]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Col>
      </Row>
    </Container>
  );
};

ListOfUsers.defaultProps = {
  users: [],
};

export default ListOfUsers;
