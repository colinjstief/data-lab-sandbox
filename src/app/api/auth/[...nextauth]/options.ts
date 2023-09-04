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
        console.log("credential =>");

        if (credentials) {
          if (credentials.token) {
            console.log("token here =>", credentials.token);
            const res = await fetch(
              "https://api.resourcewatch.org/auth/user/me",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${credentials.token}`,
                },
              }
            );
            const user = await res.json();
            console.log("user (after /auth/user/me call) =>", user);

            if (res.ok && user.status !== "failed") {
              return {
                data: {
                  access_token: credentials.token,
                  token_type: "bearer",
                },
                status: "success",
              };
            } else {
              return null;
            }
          } else {
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
            const user = await res.json();

            console.log("user (after /auth/toekn call) =>", user);

            if (res.ok && user.status !== "failed") {
              return user;
            } else {
              return null;
            }
          }
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
};
