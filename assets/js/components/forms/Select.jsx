import React from 'react';

const Select = ({name, error = "", label, value, onChange, children}) => {
	return (
		<div className="form-group">
			<label htmlFor={name}>{label}</label>
			<select
				name={name}
				id={name}
				className={"form-control" + (error && " is-invalid")}
				value={value}
				onChange={onChange}
			>
				{children}
			</select>
			<p className="invalid-feedback">{error}</p>
		</div>
	)
};

export default Select;
