"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, LoaderCircle, ArrowUpRight, LockKeyhole } from "lucide-react";

import { authClient } from "@/lib/auth/auth-client";

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message || "Unable to sign in. Please check your credentials.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-full w-full min-w-0 flex-col justify-center px-6 py-12 text-[#080d18] sm:px-10 sm:py-16 lg:px-12 xl:px-20">

      {/* FORM CONTAINER */}
      <div className="mx-auto w-full max-w-[460px]">

        {/* TOP BRAND LABEL */}
        <div className="mb-12 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dce5f3] bg-white/70 px-3.5 py-2 text-[11px] font-medium text-[#526477] shadow-sm backdrop-blur-xl">
            <span className="size-1.5 rounded-full bg-[#608bff]" />
            Your account
          </span>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8490a4]">
            <LockKeyhole size={12} strokeWidth={1.8} />
            Secure sign in
          </div>
        </div>

        {/* HEADING */}
        <div>
          <h1 className="text-[clamp(2.75rem,4.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.065em] text-[#080d18]">
            Welcome back<span className="text-[#608bff]">.</span>
          </h1>

          <p className="mt-4 max-w-[370px] text-[14px] leading-[1.8] text-[#758197]">
            Sign in to your quickshipgo account and continue discovering your next favorite finds.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">

          {/* EMAIL */}
          <div>
            <label
              htmlFor="sign-in-email"
              className="mb-2.5 block text-[12px] font-medium text-[#354258]"
            >
              Email address
            </label>

            <input
              id="sign-in-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={isSubmitting}
              className="min-h-[54px] w-full rounded-2xl border border-[#dce5f0] bg-white/80 px-4 text-[14px] text-[#080d18] outline-none transition-all duration-200 placeholder:text-[#a1adbe] hover:border-[#bccbe0] focus:border-[#7598ec] focus:bg-white focus:ring-4 focus:ring-[#608bff]/10 disabled:opacity-60"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="sign-in-password"
              className="mb-2.5 block text-[12px] font-medium text-[#354258]"
            >
              Password
            </label>

            <div className="flex min-h-[54px] overflow-hidden rounded-2xl border border-[#dce5f0] bg-white/80 transition-all duration-200 hover:border-[#bccbe0] focus-within:border-[#7598ec] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#608bff]/10">
              <input
                id="sign-in-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                disabled={isSubmitting}
                className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-[#080d18] outline-none placeholder:text-[#a1adbe] disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="grid w-12 shrink-0 place-items-center text-[#8a97aa] transition-colors hover:text-[#354258] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#608bff]"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={18} strokeWidth={1.7} />
                ) : (
                  <Eye aria-hidden="true" size={18} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-[1.6] text-red-700"
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group mt-2 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-2xl bg-[#080d18] px-6 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(8,13,24,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#172a4d] hover:shadow-[0_12px_30px_rgba(8,13,24,0.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#608bff] disabled:cursor-wait disabled:opacity-60"
          >
            <span>{isSubmitting ? "Signing in..." : "Sign in to quickshipgo"}</span>

            {isSubmitting ? (
              <LoaderCircle aria-hidden="true" size={17} className="animate-spin" />
            ) : (
              <ArrowRight
                aria-hidden="true"
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            )}
          </button>
        </form>

        {/* SIGN UP */}
        <div className="mt-7 text-center">
          <p className="text-[13px] text-[#758197]">
            New to quickshipgo?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-[#416bd1] transition-colors hover:text-[#254aa8] hover:underline hover:underline-offset-4"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* BOTTOM INFORMATION */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#dce5f0] pt-6">
          <span className="flex items-center gap-2 text-[11px] text-[#8a97aa]">
            <LockKeyhole size={12} strokeWidth={1.7} />
            Your account, securely connected.
          </span>

          <Link
            href="/"
            className="group inline-flex items-center gap-1 text-[11px] font-medium text-[#526477] transition-colors hover:text-[#416bd1]"
          >
            Back to home
            <ArrowUpRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}