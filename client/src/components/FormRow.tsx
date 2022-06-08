import { HTMLInputTypeAttribute, ChangeEvent } from "react";

interface FormRowProps {
	type: HTMLInputTypeAttribute | undefined;
	name: string;
	label: string;
	value: string;
	handleChange: (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
	) => void;
	focus?: boolean;
	isRequired?: boolean;
	title?: string;
	pattern?: string;
}

const FormRow = ({
	type,
	name,
	label,
	value,
	handleChange,
	focus = false,
	isRequired = true,
	...rest
}: FormRowProps) => {
	return (
		<div className="form-row">
			<label htmlFor={name} className="form-label">
				{label}
			</label>
			{type === "text" ? (
				<textarea
					id={name}
					value={value}
					title={"asd"}
					name={name}
					onChange={handleChange}
					className="form-message-input"
					required={isRequired}
					minLength={10} //same as in DB
					{...rest}
				/>
			) : (
				<input
					id={name}
					type={type}
					value={value}
					name={name}
					autoFocus={focus}
					autoComplete={type === "password" ? "off" : "on"}
					onChange={handleChange}
					className="form-input"
					required={isRequired}
					minLength={6} //same as in DB
					{...rest}
				></input>
			)}
		</div>
	);
};

export default FormRow;