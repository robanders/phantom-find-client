import React from 'react';
import PhotoHeader from '../components/PhotoHeader';

const VerifyEmail = () => {

    return(
        <>
            <PhotoHeader />
            <div>
                <p>
                    Please check your email for an email verification link. Once you click the link, your account will be verified and you will be able to report paranormal activity.
                    If you don't see the email, please check your junk folder. If you don't see it within 10 minutes click the button to resend the email.
                </p>
                <button>Resend verification link</button>
            </div>
        </>
    )
};

export default VerifyEmail;