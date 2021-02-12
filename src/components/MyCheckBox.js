import React from 'react';
import { useField } from 'formik';
import { Label, FormFeedback } from 'reactstrap';
import "./Form.css";

const MyCheckBox = ({ children, ...props}) => {
    const [field, meta] = useField({ ...props, type: 'checkbox' });
    return (
        <div>
            <Label className="checkbox">
                <input className="custom-checkbox"type="checkbox" {...field} {...props} />
                {children}
            </Label>
            {meta.touched && meta.error ? (
                <div className="custom-invalid-checkbox">{meta.error}</div>
            ) : null}
        </div>
    );
}

export default MyCheckBox;