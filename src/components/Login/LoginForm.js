import React, { useContext, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { UserContext } from '../../App';
import './LoginForm.css';

import {
    createUserWithEmailAndPassword,
    handleGoogleSignIn,
    handleFacebookSignIn,
    initializeLogInFrameWork,
    resetPassword,
    signInWithEmailAndPassword,
    storeAuthToken
} from './LoginManager';

import googleLogo from './logos/google.png';
import facebookLogo from './logos/facebook.png';

const LogInForm = () => {

    const { loggedInUser, setLoggedInUser, user, setUser } = useContext(UserContext);
    console.log(user.name);
    const [newUser, setNewUser] = useState(false);
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: '/' } };

    initializeLogInFrameWork();

    const handleResponse = async (response) => {
        const updatedLoggedInUser = { ...loggedInUser, ...response };
        sessionStorage.setItem('login', JSON.stringify(updatedLoggedInUser));
        setUser({ ...response });
        setLoggedInUser(updatedLoggedInUser);
        !newUser && storeAuthToken();
        !response.error && !newUser && history.push(from);
    };

    const googleSignIn = () => {
        handleGoogleSignIn().then((res) => handleResponse(res));
    };

    const facebookSignIn = () => {
        handleFacebookSignIn().then((res) => handleResponse(res));
    }

    const handleChange = (e) => {
        const newUserInfo = { ...user };
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);
    };
    const handleSubmit = (e) => {
        if (newUser && user.email && user.password) {

            if (user.password === user.confirmPassword) {
                createUserWithEmailAndPassword(user.firstName, user.email, user.password).then(
                    (res) => {
                        handleResponse(res);
                        setNewUser(false);
                    }
                );
            }
        }
        if (!newUser && user.email && user.password) {
            signInWithEmailAndPassword(user.email, user.password).then((res) =>
                handleResponse(res)
            );
        }
        e.target.reset();
        e.preventDefault();
    };
    const handleResetPass = (email) => {
        if (user.email) {
            alert('Check email to reset your password!');
            resetPassword(email);
            history.push('/login');
        }
    };

    const logOut = () => {
        setLoggedInUser({})
        setUser({
            isSignedIn: false,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            success: false,
            error: '',
            newUser: false,
        });
        sessionStorage.removeItem('login')
    }


    return (
        <section className="container">
            <div className="login-form">
                {
                    JSON.parse(sessionStorage.getItem('login'))?.email ||
                        JSON.parse(sessionStorage.getItem('login'))?.name ?
                        <>
                            <div className='mt-5'>
                                <h2>Welcome <span className='user-name'>{JSON.parse(sessionStorage.getItem('login'))?.name || JSON.parse(sessionStorage.getItem('login'))?.email?.split("@")[0]}</span>
                                </h2>
                            </div>

                            <div>
                                <Link to='/' onClick={() => logOut()} >

                                    <button className="logout-button mt-3 py-2 px-4">Log out</button>

                                </Link>
                            </div>

                        </> :
                        <>
                            {user.error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    <strong>{user.error}</strong>
                                    <button
                                        onClick={() => window.location.reload()}
                                        type="button"
                                        className="close"
                                        data-dismiss="alert"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            )}

                            {user.newUser && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    <strong>
                                        User account has{user.isSignedIn ? 'logged in' : 'created'}{' '}
                                        successfully! Please login now
                                    </strong>
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="alert"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <h3>
                                    {location.hash === '#/reset'
                                        ? 'Reset Password'
                                        : newUser
                                            ? 'Create New Account'
                                            : 'Sign In'}
                                </h3>

                                <div className="form-group">
                                    <input
                                        onChange={handleChange}
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email"
                                        required
                                    />
                                </div>

                                {!(location.hash === '#/reset') && (
                                    <div className="form-group">
                                        <input
                                            onChange={handleChange}
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            placeholder="Password"
                                            required
                                        />
                                    </div>
                                )}

                                {newUser && (
                                    <div className="form-group">
                                        <input
                                            onChange={handleChange}
                                            type="password"
                                            className="form-control"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            required
                                        />
                                    </div>
                                )}

                                {!newUser && !(location.hash === '#/reset') && (
                                    <div className=" text-start">
                                        <label className="form-check-label text-dark">
                                            <input type="checkbox" /> Remember me
                                        </label>

                                    </div>
                                )}

                                {newUser && !(location.hash === '#/reset') && (
                                    <div className=" text-start">
                                        <label className="form-check-label text-dark">
                                            <input type="checkbox" /> I agree with Terms & Conditions
                                        </label>
                                    </div>
                                )}

                                <div className="form-group">
                                    {location.hash === '#/reset' ? (
                                        <button
                                            type="button"
                                            onClick={() => handleResetPass(user.email)}
                                            className="login-btn form-control submit-btn"
                                        >
                                            Reset Password
                                        </button>
                                    ) : (
                                        <input
                                            type="submit"
                                            className="btn login-btn form-control submit-btn"
                                            value={!newUser ? 'Sign In' : 'Create Account'}
                                        />
                                    )}
                                </div>

                                {!newUser && !(location.hash === '#/reset') && (
                                    <div className="">

                                        <Link to="#/reset" className="text-black float-right text-decoration-none">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                )}

                            </form>

                            {!(location.hash === '#/reset') && (
                                <>
                                    <div className="Separator">
                                        <i>OR</i>
                                    </div>

                                    <div onClick={googleSignIn}
                                        className="social-login d-flex justify-content-around align-items-center mt-3 px-3">

                                        <img className="d-inline mx-4" src={googleLogo} alt="" />
                                        <span>Continue With Google</span>

                                    </div>

                                    <div onClick={facebookSignIn}
                                        className="social-login d-flex justify-content-around align-items-center mt-3 px-3">

                                        <img className="d-inline mx-4" src={facebookLogo} alt="" />
                                        <span>Continue With Facebook</span>

                                    </div>
                                </>
                            )}

                            <p className="mt-3 mb-5">
                                {newUser && !(location.hash === '#/reset')
                                    ? 'Already have an account?'
                                    : !(location.hash === '#/reset')
                                        ? "Don't have an account?"
                                        : ''}
                                <span className="ms-3 orange-text" onClick={() => setNewUser(!newUser)}>
                                    {newUser && !(location.hash === '#/reset')
                                        ? 'Sign In'
                                        : !(location.hash === '#/reset')
                                            ? 'SignUp'
                                            : ''}
                                </span>
                            </p>

                        </>

                }

            </div>
        </section>
    );
};
export default LogInForm;
