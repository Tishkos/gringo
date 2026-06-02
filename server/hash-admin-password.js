import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { hashPassword } from "./security.js";

async function main() {
  const providedPassword = process.env.ADMIN_PASSWORD || process.argv[2];
  const rl = readline.createInterface({ input, output });
  const password = providedPassword || (await rl.question("Admin password: "));

  rl.close();

  const hash = await hashPassword(password);
  console.log(hash);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
