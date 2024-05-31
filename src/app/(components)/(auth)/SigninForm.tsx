"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

import { wait } from "@/lib/utils";
import { signinSchema, SignInData } from "@/lib/types";
import { AsyncStatus } from "@/lib/types";
import { asyncStatuses } from "@/lib/constants/asyncStatuses";

import { Button, Icon, Form, Message, Divider } from "semantic-ui-react";

const SigninForm = () => {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const rwToken = searchParams.get("token");

  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
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
    setAsyncStatus({
      status: "loading",
      message: "Reticulating splines...",
    });

    const user = await signIn("credentials", {
      email: "",
      password: "",
      token: data.rwToken,
      redirect: false,
    });

    if (user && !user.error) {
      setAsyncStatus({
        status: "",
        message: "",
      });
      router.push("/profile");
    } else {
      setAsyncStatus({
        status: "error",
        message: "Failed to load feature",
      });
      await wait(3000);
      setAsyncStatus({
        status: "",
        message: "",
      });
    }
  };

  const onSubmit = async (data: SignInData) => {
    console.log("c");
    setAsyncStatus({
      status: "loading",
      message: "Reticulating splines...",
    });
    const user = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (user && !user.error) {
      setAsyncStatus({
        status: "success",
        message: "Login complete",
      });
      router.push("/profile");
    } else {
      setAsyncStatus({
        status: "error",
        message: "Could not sign in, check your credentials.",
      });
      await wait(3000);
      setAsyncStatus({
        status: "",
        message: "",
      });
    }
  };

  useEffect(() => {
    setCurrentUrl(window.location.origin);
  });

  useEffect(() => {
    console.log("a");
    if (rwToken) {
      console.log("b");
      tryToken({ rwToken });
    }
  });

  const asyncPresets =
    asyncStatuses[asyncStatus.status as keyof typeof asyncStatuses] ||
    asyncStatuses.default;

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
          disabled={asyncPresets.loading}
          loading={asyncPresets.loading}
          type="submit"
          fluid
        >
          Login
        </Button>
      </Form>
      {(!!Object.values(errors).length || asyncStatus.message) && (
        <Message
          color={Object.values(errors).length ? "red" : asyncPresets.color}
        >
          {!!Object.values(errors).length &&
            Object.entries(errors).map(([key, error]) => {
              return <p key={key}>{error.message}</p>;
            })}
          {!!asyncStatus.message && <p>{asyncStatus.message}</p>}
        </Message>
      )}
      {/* <Divider horizontal>Or</Divider>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          as="a"
          color="google plus"
          href={`https://api.resourcewatch.org/auth/google?token=true&callbackUrl=${currentUrl}/signin`}
        >
          <Icon name="google" /> Google
        </Button>
        <Button
          className="flex-1"
          as="a"
          color="facebook"
          href={`https://api.resourcewatch.org/auth/facebook?token=true&callbackUrl=${currentUrl}/signin`}
        >
          <Icon name="facebook" /> Facebook
        </Button>
      </div> */}
    </>
  );
};

export default SigninForm;
