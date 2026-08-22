import { OnboardingFlow } from "@/components/auth/onboarding-flow";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-xl font-semibold tracking-tight">
            Revenda<span className="text-primary">Pro</span>
          </span>
        </div>
        <OnboardingFlow />
      </div>
    </div>
  );
}
