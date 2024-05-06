import React, { useState } from "react";

import { parseUnixTimestamp } from "src/utils/utils";
import { IUser, UserType, UserTypeLabels } from "src/gql/types";
import { EmojiGreenCheck } from "src/components/SmallComponents/EmojiGreenCheck";
import { EmojiRedCross } from "src/components/SmallComponents/EmojiRedCross";

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
  const [selectedType, setSelectedType] = useState<UserType>(
    UserType.NORMAL_USER
  );

  return (
    <section className="table-responsive">
      <table className="table text-light">
        <thead>
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Is administrator?</th>
            <th scope="col">Is active?</th>
            <th scope="col">Registration date</th>
            <th scope="col">Last login</th>
            <th scope="col">User Type</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() =>
                  updateUserAdminStatus(
                    user._id,
                    !user.isAdmin,
                    user.isActive,
                    user.userType
                  )
                }
              >
                {user.isAdmin ? <EmojiGreenCheck /> : <EmojiRedCross />}{" "}
              </td>
              <td
                style={{ cursor: "pointer" }}
                onClick={() =>
                  updateUserAdminStatus(
                    user._id,
                    user.isAdmin,
                    !user.isActive,
                    user.userType
                  )
                }
              >
                {user.isActive ? <EmojiGreenCheck /> : <EmojiRedCross />}{" "}
              </td>
              <td>{parseUnixTimestamp(user.registrationDate)}</td>
              <td>{parseUnixTimestamp(user.lastLogin)}</td>
              <td style={{ cursor: "pointer" }}>
                {editing === user._id ? (
                  <select
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(e.target.value as UserType)
                    }
                    onBlur={() => {
                      updateUserAdminStatus(
                        user._id,
                        selectedType === UserType.ADMIN_USER,
                        user.isActive,
                        selectedType
                      );
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
    </section>
  );
};

ListOfUsers.defaultProps = {
  users: [],
};

export default ListOfUsers;
