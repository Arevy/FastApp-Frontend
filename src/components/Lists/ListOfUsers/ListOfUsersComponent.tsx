import React from "react";

import { parseUnixTimestamp } from "src/utils/utils";
import { User } from "src/gql/types";
import { EmojiGreenCheck } from "src/components/SmallComponents/EmojiGreenCheck";
import { EmojiRedCross } from "src/components/SmallComponents/EmojiRedCross";

interface ListOfUsersProps {
  users: User[];
}

const ListOfUsers: React.FC<ListOfUsersProps> = ({ users }) => {
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
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uuid}>
              <td>{user.email}</td>
              <td>{user.isAdmin ? <EmojiGreenCheck /> : <EmojiRedCross />}</td>
              <td>{user.isActive ? <EmojiGreenCheck /> : <EmojiRedCross />}</td>
              <td>{parseUnixTimestamp(user.registrationDate)}</td>
              <td>{parseUnixTimestamp(user.lastLogin)}</td>
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
