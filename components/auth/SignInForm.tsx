"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowUpRight, LoaderCircle } from "lucide-react";

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
        setError(
          signInError.message ||
            "Unable to sign in. Please check your credentials.",
        );
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
    <div className="flex w-full min-w-0 flex-col justify-center bg-white px-6 py-12 text-[#1c242b] sm:px-10 sm:py-16 lg:px-14 xl:px-20">
      {/* FORM HEADER */}

      <div className="mb-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#526477]">
        <span className="size-2 bg-[#2f6fed]" />
        PENTA LABS / CUSTOMER ACCESS
      </div>

      <div className="w-full max-w-[520px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#2f6fed]">
          01 / IDENTIFICATION
        </span>

        <h1 className="mt-5 text-[clamp(54px,6vw,94px)] leading-[0.92] font-bold tracking-[-0.09em]">
          WELCOME
          <br />
          BACK<span className="text-[#2f6fed]">.</span>
        </h1>

        <p className="mt-6 max-w-[390px] text-[14px] leading-[1.8] text-[#526477]">
          Sign in to your Penta Labs account and pick up where you
          left off.
        </p>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="mt-12 space-y-7">
          <div>
            <label
              htmlFor="sign-in-email"
              className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
            >
              01 — EMAIL ADDRESS
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
              placeholder="YOUR@EMAIL.COM"
              disabled={isSubmitting}
              className="min-h-14 w-full rounded-none border-2 border-[#1c242b] bg-[#f3f5f7] px-4 text-[14px] outline-none transition-colors placeholder:font-mono placeholder:text-[11px] placeholder:tracking-[0.06em] placeholder:text-[#8793a0] focus:border-[#2f6fed] disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="sign-in-password"
              className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.12em]"
            >
              02 — PASSWORD
            </label>

            <div className="flex min-h-14 border-2 border-[#1c242b] bg-[#f3f5f7] transition-colors focus-within:border-[#2f6fed]">
              <input
                id="sign-in-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="ENTER YOUR PASSWORD"
                disabled={isSubmitting}
                className="min-w-0 flex-1 bg-transparent px-4 text-[14px] outline-none placeholder:font-mono placeholder:text-[11px] placeholder:tracking-[0.06em] placeholder:text-[#8793a0] disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="grid min-w-14 place-items-center border-l-2 border-[#1c242b] transition-colors hover:bg-[#e4ebf8] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#2f6fed]"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={18} />
                ) : (
                  <Eye aria-hidden="true" size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div
              role="alert"
              className="border-l-4 border-[#2f6fed] bg-[#eaf0ff] px-4 py-3 text-[12px] leading-[1.6] text-[#183454]"
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex min-h-14 w-full items-center justify-between gap-4 border-2 border-[#1c242b] bg-[#2f6fed] px-5 text-left text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-[5px_5px_0_#1c242b] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#2456bb] hover:shadow-[2px_2px_0_#1c242b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f6fed] disabled:cursor-wait disabled:opacity-65"
          >
            <span>{isSubmitting ? "SIGNING IN..." : "ENTER PENTA LABS"}</span>

            {isSubmitting ? (
              <LoaderCircle
                aria-hidden="true"
                size={18}
                className="animate-spin"
              />
            ) : (
              <ArrowUpRight
                aria-hidden="true"
                size={20}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            )}
          </button>
        </form>

        {/* BOTTOM INFORMATION */}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#1c242b]/25 pt-5 font-mono text-[10px] uppercase tracking-[0.08em]">
          <span className="text-[#526477]">
            P/L — SECURE ACCOUNT ACCESS
          </span>

          <Link
            href="/"
            className="font-semibold transition-colors hover:text-[#2f6fed]"
          >
            RETURN TO HOME ↗
          </Link>
        </div>
      </div>
    </div>
  );
}