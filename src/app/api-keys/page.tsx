import KeyTable from "@/app/components/api-keys/KeyTable";
import KeyForm from "@/app/components/api-keys/KeyForm";

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
