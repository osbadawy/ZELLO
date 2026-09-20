import "dotenv/config";

import { prisma } from "../prisma/prisma";

const EMAIL = "admin@gmail.com";
const PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? "asdqwe123";

const APP_URL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Admin seed is disabled in production.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: EMAIL },
    select: { id: true },
  });

  if (existingUser) {
    throw new Error(
      `${EMAIL} already exists. No account or password was changed.`,
    );
  }

const response = await fetch(
  `${APP_URL.replace(/\/$/, "")}/api/auth/sign-up/email`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: APP_URL.replace(/\/$/, ""),
    },
    body: JSON.stringify({
      name: "Penta Labs Admin",
      email: EMAIL,
      password: PASSWORD,
    }),
  },
);

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `Better Auth sign-up failed (${response.status}): ${details}`,
    );
  }

  const admin = await prisma.user.update({
    where: { email: EMAIL },
    data: { role: "ADMIN" },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  console.log("Admin account created:", admin);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });