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
      },
      async authorize(credentials, req) {
        if (credentials) {
          try {
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
            if (res.ok && user) {
              return user;
            }
            return null;
          } catch (error) {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
};
