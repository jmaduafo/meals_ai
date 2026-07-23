import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main>
      <div className="flex justify-center items-center min-h-screen">
        <SignIn
          appearance={{
            // elements: {
            //   card: "shadow-2xl rounded-3xl border border-gray-200",
            //   headerTitle: "text-3xl font-bold",
            //   headerSubtitle: "text-gray-500",
            //   formButtonPrimary: "bg-green-700 hover:bg-green-800 rounded-xl",
            //   formFieldInput: "rounded-xl border-gray-300",
            //   footerActionLink: "text-green-700 hover:text-green-900",
            // },
            // variables: {
            //   colorPrimary: "#2F5233",
            //   colorBackground: "#F8F6F1",
            //   borderRadius: "14px",
            //   fontFamily: "var(--font-sans)",
            // },
            elements: {
              card: {
                fontFamily: "var(--font-sans)",
              },
              formInput: {
                backgroundColor: "transparent",
              },
              formFieldInput: {
                backgroundColor: "transparent",
              },
            },
          }}
        />
      </div>
    </main>
  );
}
