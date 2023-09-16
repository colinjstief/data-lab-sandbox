import React from "react";
import Header from "../components/layout/Header";
import Signin from "../components/form/Signin";

const SignInPage = () => {
  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header title="Sign in" description="Access your stuff" />
      <div className="p-5 mx-auto">
        <Signin />
      </div>
    </main>
  );
};

export default SignInPage;
