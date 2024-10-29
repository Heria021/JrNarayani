import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignInForm from "../../../components/shared/SignInForm";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="mb-0 sm:mb-40 w-full max-w-sm shadow-md border rounded-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            <p>Sign In for Narayani</p>
          </CardTitle>
          <p className="text-sm font-semibold text-gray-500 mt-2">
            Enter the email to sign in.
          </p>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <div className="text-center my-4 flex flex-col items-center gap-1">
          <p className="text-sm text-gray-500 leading-none">only for admin purpose.</p>
          <p className=" text-blue-600 hover:underline text-sm">owner: hariomsuthar7143@gmail.com</p>
        </div>
      </Card>
    </div>
  );
};

export default SignInPage;