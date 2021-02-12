import React, { useState } from 'react';
import ReactMapGL, { Marker, FlyToInterpolator, Popup, NavigationControl } from 'react-map-gl';
import { useMutation, useQuery } from '@apollo/client';
import GET_ENCOUNTERS from '../graphql/encounters';
import GET_ENCOUNTER from '../graphql/encounter';
import './map-style.css';
import ME from '../graphql/me';
import DELETE_ENCOUNTER from '../graphql/deleteEncounter';

const EncounterMap = () => {
    const [viewport, setViewport] = useState({
        latitude: 23.23,
        longitude: 45,
        zoom: 3
    });
    const [showPopup, setShowPopup] = useState(false);
    const [encounterId, setEncounterId] = useState(null);
    const encounters = useQuery(GET_ENCOUNTERS, {
        fetchPolicy: 'network-only'
    });
    const encounterDetails = useQuery(GET_ENCOUNTER, {
        variables: encounterId,
        skip: !showPopup
    });
    const me = useQuery(ME, {fetchPolicy: "network-only"});
    const [deleteEncounter, { client }] = useMutation(DELETE_ENCOUNTER);

    const flyToEncounter = ({lat, lng}) => {
        setViewport({
            ...viewport,
            latitude: lat,
            longitude: lng,
            zoom: 16,
            transitionDuration: 2000,
            transitionInterpolator: new FlyToInterpolator(),
        });
    }

    const formatDate = epochString => {
        const date = new Date(parseInt(epochString)).toLocaleDateString();
        return date;
    }

    const renderPopup = () => {
        if(encounterDetails.data) {
            let content = null;
            if(me.data && me.data.me && me.data.me.id === encounterDetails.data.encounter.creator.id) {
                content = <div className="ui center aliged segment">
                            <h3>{encounterDetails.data.encounter.title}</h3>
                            <small>posted by <a>{encounterDetails.data.encounter.creator.username}</a> on {formatDate(encounterDetails.data.encounter.createdAt)}</small>
                            <p className="popup-description">{encounterDetails.data.encounter.description}</p>
                            <div>
                                <button onClick={async () => {
                                    const isConfirmed = window.confirm("Are you sure you want to delete this sighting?");
                                    if(isConfirmed) {
                                        await deleteEncounter({
                                            variables: {
                                                encounterId: encounterDetails.data.encounter.id
                                            },
                                            update: (store, {data}) => {
                                                if(!data) {
                                                    return null;
                                                }
                                                store.writeQuery({
                                                    query: GET_ENCOUNTERS,
                                                    data: {
                                                        encounters
                                                    }
                                                })
                                            }
                                        })
                                        setShowPopup(false);
                                    }
                                }
                                }>delete</button>
                                <button>Edit</button>
                            </div>
                        </div> 
            } else {
                content =  <div className="ui center aliged segment">
                            <h3>{encounterDetails.data.encounter.title}</h3>
                            <small>posted by <a>{encounterDetails.data.encounter.creator.username}</a> on {formatDate(encounterDetails.data.encounter.createdAt)}</small>
                            <p className="popup-description">{encounterDetails.data.encounter.description}</p>
                        </div>
            }


            return (
                <Popup
                    className="popup"
                    latitude={encounterDetails.data.encounter.lat}
                    longitude={encounterDetails.data.encounter.lng}
                    closeButton={true}
                    closeOnClick={false}
                    dynamicPosition={false}
                    onClose={() => setShowPopup(false)}
                    offsetTop={-24}
                    anchor="bottom"
                >   
                    {content}
                </Popup>
            )
        }
        return null;
    }

    const renderMarkers = () => {
        if(encounters.error) {
            throw new Error(encounters.error);
        }
        if(!encounters.loading && encounters.data) {
            return encounters.data.encounters.map(encounter => {
                return (
                <React.Fragment key={encounter.id}>
                    <Marker latitude={encounter.lat} longitude={encounter.lng} offsetLeft={-12} offsetTop={-24}>
                        <svg
                            onClick={()=> { 
                                console.log(encounter.id, encounter.lat, encounter.lng)
                                setEncounterId({encounterId: encounter.id}); // sets encounter id to fetch details for that encounter
                                flyToEncounter(encounter);
                                setShowPopup(true);
                            } }
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
                    {showPopup ? (
                        renderPopup(encounter)
                    ) : null}
                </React.Fragment>
                );
            })
        }
        return null;
    }

  return (
    <div className="map-container">
        <ReactMapGL
            mapboxApiAccessToken="pk.eyJ1IjoicGhhbnRvbWZpbmQiLCJhIjoiY2tpNTVnNGN3MW0ycjJ5bXNoaG1udW12eCJ9.mmZdfDS7Po6sOKjssWWmXg"
            {...viewport}
            minZoom={1}
            width="100vw"
            height="100vh"
            onViewportChange={(viewport) => setViewport(viewport)}
        >
            <div style={{position: 'absolute', top: 5, right: 3}}>
                <NavigationControl />
            </div>
            {renderMarkers()}
        </ReactMapGL>
    </div>
  );
}

// #a95aec

// 5fbfe1cd4302450649c7f551

// want maxZoom 20 (default)
// lowering minZoom means that you can't zoom out as far

export default EncounterMap;