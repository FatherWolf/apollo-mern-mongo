import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import './assets/css/profile.css'

const Profile = () => {
  const { id } = useParams();

  const { loading, data, error } = useQuery(id ? QUERY_USER : QUERY_ME, {
    variables: { id },
  });

  const user = data?.me || data?.user || {};
  console.log(user)

  if (error) console.log(error);

  if (Auth.loggedIn() && Auth.getProfile().data._id === id) {
    return <Redirect to="/me" />;
  }

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (!user?.username) {
    return (
      <section className="container profile-page mt-5 min-vh-100">
        <div className="row">
          <h4>
            You need to be logged in to see this. Use the navigation links above to sign up or log in!
          </h4>
        </div>
      </section>
    );
  }

  const renderCurrentUserInfo = () => {
    if (id) return null;
    return (
      <>
        <h4>Username: {user.username}</h4>
        <h4>Email: {user.email}</h4>
      </>
    );
  };

  return (
    <div className="container-fluid profile-styles min-vh-100">
      <div className="card-profile border border-dark p-3 mt-5 m-3 col-md-3">
        {renderCurrentUserInfo()}
      </div>
    </div>
  );
};

export default Profile;
