import React from "react";
import KeyTable from "../components/collections/KeyTable";
import KeyForm from "../components/form/KeyForm";

const Keys = () => {
  return (
    <div className="text-center">
      <div className="inline-block mx-auto">
        <KeyForm />
        <KeyTable />
      </div>
    </div>
  );
};

export default Keys;
