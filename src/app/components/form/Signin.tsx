"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { signinSchema } from "@/lib/schema";
import { SignInData } from "@/lib/types";

import { Button, Icon, Form, Message, Divider } from "semantic-ui-react";

const Signin = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const rwToken = searchParams.get("token");

  const [async, setAsync] = useState({
    status: "",
    message: "",
    loading: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signinSchema),
  });

  // errors: {
  //   email: {
  //     type: 'required',
  //     message: 'Email is required',
  //     ref: input
  //   },
  //   password: {
  //     ...
  //   }
  // }

  const tryToken = async (data: any) => {
    setAsync({
      status: "Loading",
      message: "",
      loading: true,
    });
    const user = await signIn("credentials", {
      email: "",
      password: "",
      token: data.rwToken,
      redirect: false,
    });

    if (user && !user.error) {
      setAsync({
        status: "Success",
        message: "Login complete",
        loading: false,
      });
      router.push("/profile");
    } else {
      setAsync({
        status: "Error",
        message: "Could not sign in, check your credentials.",
        loading: false,
      });
    }
  };

  const onSubmit = async (data: SignInData) => {
    setAsync({
      status: "Loading",
      message: "",
      loading: true,
    });
    const user = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (user && !user.error) {
      setAsync({
        status: "Success",
        message: "Login complete",
        loading: false,
      });
      router.push("/profile");
    } else {
      setAsync({
        status: "Error",
        message: "Could not sign in, check your credentials.",
        loading: false,
      });
    }
  };

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (rwToken) {
      tryToken({ rwToken });
    }
  }, []);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Field error={!!errors.email}>
          <label>Email</label>
          <input {...register("email")} type="email" placeholder="Email" />
        </Form.Field>
        <Form.Field error={!!errors.password}>
          <label>Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
          />
        </Form.Field>
        <Button
          disabled={async?.loading}
          loading={async?.loading}
          type="submit"
          fluid
        >
          Login
        </Button>
      </Form>
      {(!!Object.values(errors).length || async.message) && (
        <Message
          {...(async.status === "Success"
            ? { positive: true }
            : { negative: true })}
        >
          <Message.Header>
            {async.status ? async.status : "Error"}
          </Message.Header>
          {!!Object.values(errors).length &&
            Object.entries(errors).map(([key, error]) => {
              return <p key={key}>{error.message}</p>;
            })}
          {!!async.message && <p>{async.message}</p>}
        </Message>
      )}
      <Divider horizontal>Or</Divider>
      <Button
        as="a"
        color="google plus"
        href={`https://api.resourcewatch.org/auth/google?token=true&callbackUrl=${currentUrl}/signin`}
      >
        <Icon name="google" /> Google
      </Button>
      <Button
        as="a"
        color="facebook"
        href={`https://api.resourcewatch.org/auth/facebook?token=true&callbackUrl=${currentUrl}/signin`}
      >
        <Icon name="facebook" /> Facebook
      </Button>
    </>
  );
};

export default Signin;
