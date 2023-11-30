import React, { useEffect } from 'react';

import { EmojiGreenCheck } from '../EmojiGreenCheck';
import { EmojiRedCross } from '../EmojiRedCross';
import { parseUnixTimestamp } from 'src/utils/utils';

interface User {
	uuid: React.Key | null | undefined;
	email: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined;
	isAdmin: any;
	isActive: any;
	registrationDate: string | number;
	lastLogin: string | number;
}

interface ListOfUsersProps {
	users: User[];
	startPolling: (time: number) => void;
	stopPolling: () => void;
}

const ListOfUsers: React.FC<ListOfUsersProps> = ({ users, startPolling, stopPolling }) => {
	useEffect(() => {
		const minuteInMilliseconds = 60000;
		const tenMinutes = minuteInMilliseconds * 10;
		startPolling(tenMinutes);

		return () => {
			stopPolling();
		};
	}, [startPolling, stopPolling]);

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
