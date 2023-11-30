import { useState, ChangeEvent } from 'react';

export interface InputValueHook {
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function useInputValue(initialValue: string): InputValueHook {
	const [value, setValue] = useState(initialValue);

	const onChange = (e: ChangeEvent<HTMLInputElement>): void => setValue(e.target.value);

	return { value, onChange };
}
