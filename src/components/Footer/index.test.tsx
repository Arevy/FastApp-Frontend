import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Footer } from '.';

describe('Footer', () => {
	it('renders a link with correct attributes', () => {
		const { getByText } = render(<Footer />);

		const linkElement = getByText('didaquis') as HTMLAnchorElement;

		expect(linkElement.href).toBe('https://didaquis.github.io/');
		expect(linkElement.closest('a')).toHaveAttribute('href', 'https://didaquis.github.io/');
		expect(linkElement.target).toBe('_blank');
		expect(linkElement.rel).toBe('noreferrer noopener');
	});

	it('contains an expected text', () => {
		render(<Footer />);

		const expectedText = 'Made by didaquis';

		screen.getByText((content, node) => {
			const hasText = (node: Element | null) => node?.textContent === expectedText;
			const nodeHasText = hasText(node);
			const childrenDontHaveText = Array.from(node?.children || []).every(
				(child) => !hasText(child as Element | null)
			);

			return nodeHasText && childrenDontHaveText;
		});
	});
});
