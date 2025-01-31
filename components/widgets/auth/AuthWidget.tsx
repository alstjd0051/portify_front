import { AuthForm } from "@/components/features/auth/AuthForm";
import { AuthProviders } from "@/components/features/auth/AuthProviders";
import { Card } from "@/components/shared/ui/card";

export const AuthWidget = () => {
  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          포티파이에 오신 것을 환영합니다
        </h1>
        <p className="text-sm text-muted-foreground">
          로그인하여 나만의 포트폴리오를 만들어보세요
        </p>
      </div>

      <AuthProviders />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            또는 이메일로 계속하기
          </span>
        </div>
      </div>

      <AuthForm />
    </Card>
  );
};
