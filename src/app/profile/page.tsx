import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import Header from "@/app/components/layout/Header";

interface ProfileProps {}

const colors = {
  "primary-blue": "bg-primary-blue",
  "primary-green": "bg-primary-green",
  "primary-salmon": "bg-primary-salmon",
};

const getData = async (token: string) => {
  const res = await fetch("https://api.resourcewatch.org/v2/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const Profile = async (props: ProfileProps) => {
  const session = await getServerSession(options);

  let data;
  if (session?.user?.rwToken) {
    data = await getData(session?.user?.rwToken);
  }

  let rwData;
  if (data?.data) {
    rwData = (
      <div className="p-5 border-b border-gray-300">
        <h2 className="font-bold uppercase mb-2">Resource Watch API</h2>
        <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">Role</h3>
          <div className="flex flex-wrap justify-end">{data.data.type}</div>
        </div>
        <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">ID</h3>
          <div className="flex flex-wrap justify-end">{data.data.id}</div>
        </div>
        <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">Email</h3>
          <div className="flex flex-wrap justify-end">
            {data.data.attributes.email}
          </div>
        </div>
        <div className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between">
          <h3 className="italic mb-2 pr-5">Created on</h3>
          <div className="flex flex-wrap justify-end">
            {data.data.attributes.createdAt}
          </div>
        </div>
      </div>
    );
  } else {
    rwData = <p>No RW data available</p>;
  }

  let gfwData;
  if (data?.data?.attributes?.applicationData?.gfw) {
    gfwData = (
      <div className="p-5">
        <h2 className="font-bold uppercase mb-2">MyGFW Profile</h2>
        <div>
          {Object.entries(data.data.attributes.applicationData.gfw).map(
            ([property, value]: any, index) => {
              let valueFormatted;

              switch (typeof value) {
                case "string":
                  valueFormatted = value;
                  break;

                case "boolean":
                  valueFormatted = value ? "Yes" : "No";
                  break;

                case "object":
                  if (value === null) {
                    valueFormatted = "N/A";
                  } else {
                    valueFormatted = value.map((tag: any, index: any) => {
                      return (
                        <span
                          key={index}
                          className={`p-2 ml-2 mb-2 rounded-md text-white text-sm ${
                            Object.values(colors)[
                              index % Object.values(colors).length
                            ]
                          }`}
                        >
                          {tag}
                        </span>
                      );
                    });
                  }
                  break;

                default:
                  break;
              }

              return (
                <div
                  key={index}
                  className="py-2 mr-10 mb-2 flex border-b border-gray-200 justify-between"
                >
                  <h3 className="italic mb-2 pr-5">{property}</h3>
                  <div className="flex flex-wrap justify-end">
                    {valueFormatted}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  } else {
    gfwData = <p>No MyGFW data available</p>;
  }

  return (
    <main className="flex flex-col flex-1 overflow-auto">
      <Header title="Profile" description="Your MyGFW profile" />
      <div className="flex flex-col shadow-md border border-gray-300 rounded m-5">
        {rwData}
        {gfwData}
      </div>
    </main>
  );
};

export default Profile;
