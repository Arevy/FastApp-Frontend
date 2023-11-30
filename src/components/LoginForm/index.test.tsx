// LoginForm/index.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { FetchResult } from '@apollo/client';

import { LOGIN } from '../../gql/mutations/auth';
import LoginForm from '.';
import { GraphQLError } from 'graphql';

interface CustomMockedResponse<TData = Record<string, any>> extends MockedResponse<TData> {
	result?: FetchResult<TData>;
}

describe('LoginForm', () => {
	it('should render a disabled button until password and email inputs are filled with data', () => {
		const activateAuth = jest.fn();
		const mocks: CustomMockedResponse[] = [];

		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<LoginForm activateAuth={activateAuth} />
			</MockedProvider>
		);

		const emailInput = screen.getByRole('textbox', { name: /Email/i }) as HTMLInputElement;
		const passwordInput = screen.getByPlaceholderText(/password/) as HTMLInputElement;
		const submitButton = screen.getByRole('button', { name: 'Log in' });

		expect(emailInput.value).toBe('');
		expect(passwordInput.value).toBe('');
		expect(submitButton).toBeDisabled();

		fireEvent.change(emailInput, { target: { value: 'example@mail.com' } });
		expect(submitButton).toBeDisabled();

		fireEvent.change(passwordInput, { target: { value: 'ABCabc*1234*4321' } });
		expect(submitButton).not.toBeDisabled();

		fireEvent.change(emailInput, { target: { value: '' } });
		fireEvent.change(passwordInput, { target: { value: '' } });
		expect(submitButton).toBeDisabled();
	});

	it('should call to activateAuth method passing a token as an argument if credentials are valid', async () => {
		const activateAuth = jest.fn();
		const mocks: CustomMockedResponse[] = [
			{
				request: {
					query: LOGIN,
					variables: {
						email: 'example@mail.com',
						password: 'ABCabc*1234*4321',
					},
				},
				result: {
					data: {
						authUser: {
							token: 'f3b2c1a0d2',
						},
					},
				},
			},
		];

		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<LoginForm activateAuth={activateAuth} />
			</MockedProvider>
		);

		const emailInput = screen.getByRole('textbox', { name: /Email/i }) as HTMLInputElement;
		const passwordInput = screen.getByPlaceholderText(/password/) as HTMLInputElement;
		const submitButton = screen.getByRole('button', { name: 'Log in' });

		fireEvent.change(emailInput, { target: { value: 'example@mail.com' } });
		fireEvent.change(passwordInput, { target: { value: 'ABCabc*1234*4321' } });
		fireEvent.click(submitButton);

		const submitButtonLoadingState = screen.getByRole('button', { name: 'Loading' });

		expect(submitButtonLoadingState).toBeInTheDocument();
		expect(submitButtonLoadingState).toBeDisabled();

		await waitFor(() => expect(activateAuth).toHaveBeenCalled());
		expect(activateAuth).toHaveBeenCalledWith('f3b2c1a0d2');
	});

	it('should render an error if credentials are not valid', async () => {
		const activateAuth = jest.fn();
		const mocks: CustomMockedResponse[] = [
			{
				request: {
					query: LOGIN,
					variables: {
						email: 'example@mail.com',
						password: 'ABCabc*1234*4321',
					},
				},
				result: {
					errors: [
						{
							message: 'Invalid credentials',
							locations: [],
							path: [],
							nodes: [],
							source: undefined,
							// Add any other necessary properties based on your actual GraphQL error
						},
					] as unknown as GraphQLError[],
				},

			},
		];

		render(
			<MockedProvider mocks={mocks} addTypename={false}>
				<LoginForm activateAuth={activateAuth} />
			</MockedProvider>
		);

		const emailInput = screen.getByRole('textbox', { name: /Email/i }) as HTMLInputElement;
		const passwordInput = screen.getByPlaceholderText(/password/) as HTMLInputElement;
		const submitButton = screen.getByRole('button', { name: 'Log in' });

		fireEvent.change(emailInput, { target: { value: 'example@mail.com' } });
		fireEvent.change(passwordInput, { target: { value: 'ABCabc*1234*4321' } });
		fireEvent.click(submitButton);

		await waitFor(() => expect(activateAuth).not.toHaveBeenCalled());

		const submitButtonAfterCTA = await screen.findByRole('button', { name: 'Log in' });

		expect(submitButtonAfterCTA).toBeInTheDocument();
		expect(submitButtonAfterCTA).not.toBeDisabled();

		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Invalid credentials'));
	});
});

// Note: You need to replace YOUR_GRAPHQL_QUERY with your actual GraphQL query

