import React, {useEffect, useState, useRef} from 'react';
import CREATE_USER from '../graphql/createUser';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from './MyTextInput';
import MyCheckBox from './MyCheckBox';
import './Form.css';
import { Spinner, Button, Alert } from 'reactstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const Signup = () => {
    const [createUser, { data, error }] = useMutation(CREATE_USER);
    const history = useHistory();
    const [showSpinner, setShowSpinner] = useState(false);
    const reRef = useRef();

    useEffect(() => {
        if(error) {
            setShowSpinner(false);
        }
    }, [error]);

    // .col-sm-12 .col-md-6 .offset-md-3
    return (
        <section className="inner-section">
            <div className="outer-form-container">
                    <div className=" custom-form">
                        <h1 className="sign-up-header">Create your account</h1>
                        {error && error.message ? (<Alert className="form-alert" color="danger">{error.message}</Alert>) : null}
                        <ReCAPTCHA sitekey={process.env.REACT_APP_CLIENT_RECAPTCHA} size="invisible" ref={reRef}/>
                        <Formik
                            initialValues={{
                                username: '',
                                email: '',
                                password: '',
                                acceptedTerms: false
                            }}
                            validationSchema={Yup.object({
                                username: Yup.string()
                                .max(15, 'Must be 15 characters or fewer')
                                .required('Username is a required field'),
                                email: Yup.string()
                                .email('Invalid email address')
                                .required('Required'),
                                password: Yup.string()
                                .min(8, 'Password must be longer than 8 characters')
                                .max(128, 'Password must 128 characters or fewer')
                                .required('Required'),
                                acceptedTerms: Yup.boolean()
                                .required('Required')
                                .oneOf([true], 'You must accept the terms and conditions')
                            })}
                            onSubmit={ async ({username, email, password}, { setSubmitting }) => {
                                setShowSpinner(true);
                                const recapToken = await reRef.current.executeAsync();
                                reRef.current.reset();
                                await createUser({
                                    variables: {
                                        userInput: {
                                            username,
                                            email,
                                            password,
                                            recapToken
                                        }
                                    }
                                });
                                setSubmitting(false);
                                setShowSpinner(false);
                                history.push("/verify");
                            }}
                            
                        >
                            <Form>
                                <MyTextInput
                                    label="Username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter username"
                                />
                                <MyTextInput
                                    label="Email"
                                    name="email"
                                    type="text"
                                    placeholder="Enter email"
                                />
                                <MyTextInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                />
                                <MyCheckBox name="acceptedTerms">
                                    <small >I have read and accept the <a href="/terms">terms and conditions</a>.</small>
                                </MyCheckBox>
                                <Button disabled={showSpinner} block className="submit-button" type="submit">Continue</Button>
                                {showSpinner ? (
                                <div className="spinner-container">
                                    <Spinner className="spinner" style={{ width: '3rem', height: '3rem' }} />
                                </div>
                                
                                ) : null}
                                <hr className="solid" />
                                <div className="logged-in">
                                    <a href="/login">Already have an account? Log in.</a>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
        </section>
        
    );
};

export default Signup;