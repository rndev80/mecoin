import React from 'react';
import './SignupPage.scss';

import { PageTemplate, Footer } from 'components';
import { HeaderContainer, RegisterContainer } from 'containers';

const signupForm = {
  paddingTop: '150px',
  paddingBottom: '150px'
};

const SignupPage = () => {
  return (
  <PageTemplate header={<HeaderContainer/>} footer={<Footer/>}>
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-6 mx-auto" style={signupForm}>
            <RegisterContainer />
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default SignupPage;