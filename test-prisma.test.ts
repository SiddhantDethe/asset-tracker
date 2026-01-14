// test-prisma.test.ts

import { prisma } from "./lib/prisma";

describe("Prisma Connection Test", () => {
  it("should fetch all users", async () => {
    const users = await prisma.user.findMany();
    console.log("✅ Users:", users);
    expect(Array.isArray(users)).toBe(true);
  });
});
