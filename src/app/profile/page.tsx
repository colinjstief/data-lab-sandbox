import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import Header from "@/app/components/layout/Header";

interface ProfileProps {}

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
        <h2 className="font-bold uppercase">Resource Watch API</h2>
        <div className="py-2">
          <h3>Role</h3>
          <p>{data.data.type}</p>
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
        <h2 className="font-bold uppercase">MyGFW Profile</h2>
        <div className="flex flex-wrap">
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
                        <span key={index} className="p-2 mr-4">
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
                <div key={index} className="py-2 mr-10 mb-6">
                  <h4 className="font-bold">{property}</h4>
                  <div className="flex flex-wrap">{valueFormatted}</div>
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
      <div className="flex flex-col bg-white shadow-md border border-gray-300 rounded m-5">
        {rwData}
        {gfwData}
      </div>
    </main>
  );
};

export default Profile;
