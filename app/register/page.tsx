import RegisterForm from "@/features/auth/components/RegisterForm";

export const metadata = {
  title: "Institute Registration | Exam System",
  description: "Register your institute on our exam system",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden font-[family-name:var(--font-geist-sans)]">
      {/* Dynamic Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none translate-x-[-50%] translate-y-[-50%]" />

      {/* Form Container */}
      <div className="z-10 w-full px-4 sm:px-6 flex justify-center py-12">
        <RegisterForm />
      </div>
    </div>
  );
}
