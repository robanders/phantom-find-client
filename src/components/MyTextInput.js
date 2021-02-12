import React, { useState, useEffect } from 'react';
import { useField } from 'formik';
import {Label, Input, FormFeedback} from 'reactstrap'

const MyTextInput = ({ label, ...props}) => {
    const [field, meta] = useField(props);
    let hasError = meta.touched && meta.error && meta.error.length > 0; // for some reason (meta.touched && meta.error) came back as a string

    return (
        <>
            <Label htmlFor={props.id || props.name}>{label}</Label>
            <Input invalid={hasError} className="text-input" {...field } {...props} />
            {meta.touched && meta.error ? 
                (<FormFeedback>{meta.error}</FormFeedback>)
            : null} 
        </>
    )
}

export default MyTextInput;