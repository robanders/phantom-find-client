import React, {useState, useCallback, useEffect, useRef} from 'react';
import CREATE_ENCOUNTER from '../graphql/createEncounter';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import { Formik, Form, useField, Field } from 'formik';
import ReactMapGL, { Marker, Popup, NavigationControl } from 'react-map-gl';
import * as Yup from 'yup';
import MyTextInput from './MyTextInput';
import ME from '../graphql/me';
import './Form.css';
import { Spinner, Button } from 'reactstrap';
import ReCAPTCHA from 'react-google-recaptcha';

const CreateEncounter = () => {
    const [createEncounter, { data, error }] = useMutation(CREATE_ENCOUNTER);
    const me = useQuery(ME);
    const [showSpinner, setShowSpinner] = useState(false);
    const reRef = useRef();
    const history = useHistory();
    const [viewport, setViewport] = useState({
        latitude: 36.8,
        longitude: -98,
        zoom: 2
    });
    const[marker, setMarker] = useState({
        latitude: 35,
        longitude: -98
    
    });
    const [events, logEvents] = useState({});

    const onMarkerDragStart = useCallback(event => {
        logEvents(_events => ({..._events, onDragStart: event.lngLat}));
      }, []);
    
      const onMarkerDrag = useCallback(event => {
        logEvents(_events => ({..._events, onDrag: event.lngLat}));
      }, []);
    
      const onMarkerDragEnd = useCallback(event => {
        logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
        setMarker({
          longitude: event.lngLat[0],
          latitude: event.lngLat[1]
        });
      }, []);

    useEffect(() => {
        if(error) {
            setShowSpinner(false);
        }
    }, [error])

    if(!me.loading && !me.data.me) {
        history.push("/login");
        return null;
    } else {
        return (
            <section className="inner-section">
                <div className="outer-form-container">
                    <div className=" custom-form">
                        <h1 className="sign-up-header">Report a Paranormal Encounter</h1>
                        <hr className="solid" />
                        <ReCAPTCHA sitekey={process.env.REACT_APP_CLIENT_RECAPTCHA} size="invisible" ref={reRef}/>
                        <Formik
                            initialValues={{
                                lat: null,
                                lng: null,
                                title: '',
                                description: '',
                            }}
                            validationSchema={Yup.object({
                                title: Yup.string()
                                .min(4, 'Title must be longer than 4 characters')
                                .max(128, 'Password must 128 characters or fewer')
                                .required('Required'),
                                description: Yup.string()
                                .min(24, 'description must be longer than 24 characters')
                                .max(2048, 'description must be 2048 characters or fewer')
                                .required('Required')
                                
                            })}
                            onSubmit={ async ({title, description}, { setSubmitting }) => {
                                setShowSpinner(true);
                                const recapToken = await reRef.current.executeAsync();
                                reRef.current.reset();
                                await createEncounter({
                                    variables: {
                                        encounterInput: {
                                            lat: marker.latitude,
                                            lng: marker.longitude,
                                            title,
                                            description,
                                            recapToken
                                        }
                                    }
                                });
                                setSubmitting(false);
                                setShowSpinner(false);
                                history.push("/");
                            }}
                        >
                            <Form>
                                <p className="marker-instructions">Drag the marker to the encounter location</p>
                                <div className="map-container">
                                        <ReactMapGL
                                            mapboxApiAccessToken="pk.eyJ1IjoicGhhbnRvbWZpbmQiLCJhIjoiY2tpNTVnNGN3MW0ycjJ5bXNoaG1udW12eCJ9.mmZdfDS7Po6sOKjssWWmXg"
                                            {...viewport}
                                            minZoom={1}
                                            width="75vw"
                                            height="25vh"
                                            onViewportChange={(viewport) => setViewport(viewport)}
                                        >
                                        <div style={{position: 'absolute', top: 5, right: 3}}>
                                            <NavigationControl />
                                        </div>
                                        <Marker
                                            longitude={marker.longitude}
                                            latitude={marker.latitude}
                                            offsetTop={-20}
                                            offsetLeft={-10}
                                            draggable
                                            onDragStart={onMarkerDragStart}
                                            onDrag={onMarkerDrag}
                                            onDragEnd={onMarkerDragEnd}
                                        >
                                            <svg
                                                cursor="pointer"
                                                className="marker"
                                                style={{
                                                    width: "24px",
                                                    height: "24px"
                                                }}
                                                viewBox="0 0 24 24" 
                                                stroke="#a95aec" 
                                                strokeWidth="2" 
                                                fill="none" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                >
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                                            </svg> 
                                        
                                        </Marker>
                                    </ReactMapGL>
                                </div>
                                <MyTextInput
                                    value={marker.latitude}
                                    label="Latitude"
                                    name="lat"
                                    type="number"
                                    placeholder="Enter latitude"
                                    disabled={true}
                                />
                                <MyTextInput
                                    value={marker.longitude}
                                    label="Longitude"
                                    name="lng"
                                    type="number"
                                    placeholder="Enter longitude"
                                    disabled={true}
                                />
                                <MyTextInput
                                    label="Title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter a title for this encounter"
                                />
                                <MyTextInput
                                    label="Description"
                                    name="description"
                                    type="textarea"
                                    placeholder="Describe what you saw"
                                />
                                {/* <MyTextInput
                                    label="Encounter Date"
                                    name="encounteredAt"
                                    type="text"
                                    placeholder="Enter encounter date"
                                /> */}
                                <hr className="solid" />
                                <Button disabled={showSpinner} block className="submit-button" type="submit">Create Encounter</Button>
                                {showSpinner ? (
                                    <div className="spinner-container">
                                        <Spinner className="spinner" style={{ width: '3rem', height: '3rem' }} />
                                    </div>
                                ) : null}
                            </Form>
                        </Formik>
                    </div>
                </div>
            </section>
        );
    }

    
};

// 19.116055220084593
// 17.209407297157743


export default CreateEncounter;