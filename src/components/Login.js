import React, {useState, useRef, useEffect} from 'react';
import LOGIN from '../graphql/login';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Form as RSForm, FormGroup as RSFormGroup, Button, Alert, Spinner} from 'reactstrap';
import MyTextInput from './MyTextInput';
import { setAccessToken } from '../accessToken';
import ME from '../graphql/me';
import './Form.css';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
    const [login, { data, error }] = useMutation(LOGIN, {refetchQueries: ME, awaitRefetchQueries: true});
    const history = useHistory();
    const [showSpinner, setShowSpinner] = useState(false);
    const reRef = useRef();

    useEffect(() => {
        if(error) {
            setShowSpinner(false);
        }
    }, [error]);
    
    return (
        <section className="inner-section">
            <div className="outer-form-container">
                <div className="custom-form">
                    <h1 className="sign-up-header">Log in to report paranormal activity</h1>
                    {error && error.message ? (<Alert className="form-alert" color="danger">{error.message}</Alert>) : null}
                    <ReCAPTCHA sitekey={process.env.REACT_APP_CLIENT_RECAPTCHA} size="invisible" ref={reRef}/>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        onSubmit={ async ({email, password}, { setSubmitting }) => {
                            setShowSpinner(true);
                            const recapToken = await reRef.current.executeAsync();
                            reRef.current.reset();
                            const response = await login({
                                variables: {
                                    loginInput: { 
                                        email,
                                        password,
                                        recapToken
                                    }
                                },
                                update: (store, { data }) => {
                                    if(!data) {
                                        return null;
                                    }
                                    store.writeQuery({
                                        query: ME,
                                        data: {
                                            me: data.login.user
                                        }
                                    })
                                }
                            });
                            if(response && response.data) {
                                console.log(response.data)
                                setAccessToken(response.data.login.accessToken);
                            }
                            setSubmitting(false);
                            setShowSpinner(false);
                            history.push("/");
                        }}
                    >
                        <Form>
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
                            <div>
                                <small className="forgot-pw"><a href="/">I forgot my password</a></small>
                            </div>
                            <Button block className="small-button" type="submit">Login</Button>
                            {showSpinner ? (
                                <div className="spinner-container">
                                    <Spinner className="spinner" style={{ width: '3rem', height: '3rem' }} />
                                </div>
                                ) : null}
                            <hr className="solid" />
                            <div className="logged-in">
                                <a href="/signup">Don't have an account? Sign Up.</a>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        </section>
    );
};

export default Login;