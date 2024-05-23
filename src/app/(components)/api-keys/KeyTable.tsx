import { getKeys } from "@/lib/apis/gfw";

import DeleteButton from "@/app/(components)/api-keys/DeleteButton";

const Keys = async () => {
  const res = await getKeys();
  const keys = res.data;

  return (
    <div className="w-full shadow-md border border-gray-300 rounded p-5 overflow-x-auto">
      <h2 className="text-xl font-bold mb-5">Your keys</h2>
      <table className="w-full">
        <thead className="">
          <tr className="text-center">
            <th colSpan={1} className="px-5 py-4">
              Alias
            </th>
            <th colSpan={1}>Key</th>
            <th colSpan={1} className="min-w-[110px]">
              Created
            </th>
            <th colSpan={1}>Org</th>
            <th colSpan={1}>Email</th>
            <th colSpan={1}>Domains</th>
            <th colSpan={1} className="min-w-[110px]">
              Expires
            </th>
            <th colSpan={1}>Action</th>
          </tr>
        </thead>
        <tbody className="">
          {keys?.reverse().map((key) => {
            return (
              <tr key={key.alias} className="border-b py-2">
                <td className="px-5 py-2">{key.alias}</td>
                <td className="px-5 py-2">{key.api_key}</td>
                <td className="px-5 py-2">
                  {key.created_on ? key.created_on.split("T")[0] : ""}
                </td>
                <td className="px-5 py-2">{key.organization}</td>
                <td className="px-5 py-2">{key.email}</td>
                <td className="px-5 py-2">{key.domains.join(", ")}</td>
                <td className="px-5 py-2">
                  {key.expires_on
                    ? key.expires_on.split("T")[0]
                    : "Does not expire"}
                </td>
                <td className="px-5 py-2">
                  <DeleteButton api_key={key} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Keys;
