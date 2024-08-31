import React, { useState } from 'react';
import {
  FormGroup,
  Input,
  Label,
  Container,
  Row,
  Col,
  Table,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from 'reactstrap';
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
  deleteUser?: (_id: string) => void;
}

const ListOfUsers: React.FC<ListOfUsersProps> = ({
  users,
  updateUserAdminStatus,
  deleteUser,
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

  const rowHoverStyle = {
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  };

  const cardHoverStyle = {
    borderRadius: '10px',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const cardBodyHoverStyle = {
    backgroundColor: '#65b5c2',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  };

  return (
    <Container className="my-4 py-4">
      <Row className="justify-content-center mb-4">
        <Col md={6} className="mb-3">
          <FormGroup>
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
        </Col>
        <Col md={6} className="mb-3">
          <FormGroup>
            <Label for="userType" className="text-light">
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
      {/* Tabel pe Desktop */}
      <Row className="d-none d-lg-flex">
        <Col xs={12}>
          <Table responsive striped className="text-light">
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Is administrator?</th>
                <th>Is active?</th>
                <th>Registration date</th>
                <th>Last login</th>
                <th>User Type</th>
                {!!deleteUser && <th>Delete</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  style={rowHoverStyle}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#5b838a')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '')
                  }
                >
                  <td>{user.email}</td>
                  <td>{user.userName || 'No Username'}</td>
                  <td
                    onClick={() =>
                      updateUserAdminStatus(
                        user._id,
                        !user.isAdmin,
                        user.isActive,
                        user.userType
                      )
                    }
                  >
                    {user.isAdmin ? <EmojiGreenCheck /> : <EmojiRedCross />}
                  </td>
                  <td
                    onClick={() =>
                      updateUserAdminStatus(
                        user._id,
                        user.isAdmin,
                        !user.isActive,
                        user.userType
                      )
                    }
                  >
                    {user.isActive ? <EmojiGreenCheck /> : <EmojiRedCross />}
                  </td>
                  <td>{parseUnixTimestamp(user.registrationDate)}</td>
                  <td>{parseUnixTimestamp(user.lastLogin)}</td>
                  <td>
                    {editing === user._id ? (
                      <Input
                        type="select"
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
                          setEditing(null);
                        }}
                      >
                        {Object.values(UserType).map((type) => (
                          <option key={type} value={type}>
                            {UserTypeLabels[type]}
                          </option>
                        ))}
                      </Input>
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
                  {!!deleteUser && (
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      {/* Carduri pe Mobile și Tablete */}
      <Row className="d-lg-none">
        {filteredUsers.map((user) => (
          <Col xs={12} md={6} className="mb-3" key={user._id}>
            <Card
              className="bg-light text-dark shadow-sm"
              style={cardHoverStyle}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, cardBodyHoverStyle)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, cardHoverStyle)
              }
            >
              <CardBody className="p-3">
                <CardTitle
                  tag="h5"
                  className="d-flex justify-content-between align-items-center"
                >
                  {user.email}
                </CardTitle>
                <CardText>
                  <strong>Username:</strong> {user.userName || 'No Username'}
                </CardText>
                <CardText>
                  <strong>Is administrator?:</strong>{' '}
                  <span
                    onClick={() =>
                      updateUserAdminStatus(
                        user._id,
                        !user.isAdmin,
                        user.isActive,
                        user.userType
                      )
                    }
                  >
                    {user.isAdmin ? <EmojiGreenCheck /> : <EmojiRedCross />}
                  </span>
                </CardText>
                <CardText>
                  <strong>Is active?:</strong>{' '}
                  <span
                    onClick={() =>
                      updateUserAdminStatus(
                        user._id,
                        user.isAdmin,
                        !user.isActive,
                        user.userType
                      )
                    }
                  >
                    {user.isActive ? <EmojiGreenCheck /> : <EmojiRedCross />}
                  </span>
                </CardText>
                <CardText>
                  <strong>Registration date:</strong>{' '}
                  {parseUnixTimestamp(user.registrationDate)}
                </CardText>
                <CardText>
                  <strong>Last login:</strong>{' '}
                  {parseUnixTimestamp(user.lastLogin)}
                </CardText>
                <CardText>
                  <strong>User Type:</strong>{' '}
                  {editing === user._id ? (
                    <Input
                      type="select"
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
                        setEditing(null);
                      }}
                    >
                      {Object.values(UserType).map((type) => (
                        <option key={type} value={type}>
                          {UserTypeLabels[type]}
                        </option>
                      ))}
                    </Input>
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
                </CardText>
                {!!deleteUser && (
                  <Button color="danger" onClick={() => deleteUser(user._id)}>
                    Delete
                  </Button>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

ListOfUsers.defaultProps = {
  users: [],
};

export default ListOfUsers;
