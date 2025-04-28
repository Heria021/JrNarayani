import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "../_components/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Narayani",
  description: "Sign in to your Narayani account",
};

const SignInPage = () => {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Narayani
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in to your account
          </p>
        </div>
        <Card className="border-border/40">
          <CardContent className="pt-6">
            <SignInForm />
          </CardContent>
        </Card>
        <div className="text-center text-sm text-muted-foreground">
          <p>Admin access only</p>
          <p className="mt-1 hover:underline cursor-pointer">
            Contact: hariomsuthar7143@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;