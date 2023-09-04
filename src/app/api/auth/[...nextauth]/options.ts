import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email: ",
          type: "email",
          placeholder: "",
        },
        password: {
          label: "Password: ",
          type: "password",
          placeholder: "",
        },
        token: {
          label: "Token: ",
          type: "token",
          placeholder: "",
        },
      },
      async authorize(credentials, req) {
        if (credentials) {
          let access_token;

          if (credentials.email) {
            const params = new URLSearchParams();
            params.append("username", credentials.email);
            params.append("password", credentials.password);

            const res = await fetch(
              "https://data-api.globalforestwatch.org/auth/token",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params,
              }
            );
            const data = await res.json();

            // data = {
            //   data: {
            //     access_token: 'eyJhb...',
            //     token_type: 'bearer'
            //   },
            //   status: 'success'
            // }

            if (!res.ok || !data.data?.access_token) {
              return null;
            }
            access_token = data.data.access_token;
          } else if (credentials.token) {
            access_token = credentials.token;
          } else {
            return null;
          }

          const res = await fetch(
            "https://api.resourcewatch.org/auth/user/me",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
          const data = await res.json();

          // data = {
          //   id: "6351c8e346f91a28f61b6f5e",
          //   _id: "6351c8e346f91a28f61b6f5e",
          //   email: "sky.chancy.0l@icloud.com",
          //   provider: "local",
          //   role: "USER",
          //   extraUserData: { apps: ["gfw"] },
          //   createdAt: "2022-10-20T22:17:08.000Z",
          //   updatedAt: "2022-10-20T22:17:24.000Z",
          //   applications: [],
          //   organizations: [],
          // };

          if (!res.ok || !data?.id) {
            return null;
          }

          return {
            rwToken: access_token,
            id: data.id,
            email: data.email,
            role: data.role,
            createdAt: data.createdAt,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rwToken = user.rwToken;
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.createdAt = user.createdAt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.rwToken = token.rwToken;
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.createdAt = token.createdAt;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
