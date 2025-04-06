import TrueFocus from '@/components/TrueFocus';
import  LoginForm  from "@/components/Login-Form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
        <TrueFocus 
        sentence="Smart Cricket"
        manualMode={true}
        blurAmount={4.5}
        borderColor="#00d8ff"
        animationDuration={0.5}
        pauseBetweenAnimations={0.8}
        />
    </div>
  );
}
