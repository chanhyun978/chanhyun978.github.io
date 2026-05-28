import { createRequire } from "node:module";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startPreviewServer } from "./serve.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(projectRoot, "dist", "wedding-invitation-a5.pdf");
const port = Number(process.env.PORT || 4173);

function requireFromRuntime(packageName) {
  const localRequire = createRequire(import.meta.url);

  try {
    return localRequire(packageName);
  } catch {
    const bundledModules = path.join(
      process.env.USERPROFILE || "",
      ".cache",
      "codex-runtimes",
      "codex-primary-runtime",
      "dependencies",
      "node",
      "node_modules",
    );
    const pnpmModules = path.join(bundledModules, ".pnpm");
    const packageFolder = readdirSync(pnpmModules).find((folder) =>
      folder.startsWith(`${packageName}@`),
    );

    if (!packageFolder) {
      return createRequire(path.join(bundledModules, "noop.cjs"))(packageName);
    }

    return createRequire(path.join(pnpmModules, packageFolder, "node_modules", "noop.cjs"))(
      packageName,
    );
  }
}

function findBrowserExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    path.join(process.env.PROGRAMFILES || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(process.env["PROGRAMFILES(X86)"] || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(process.env["PROGRAMFILES(X86)"] || "", "Microsoft", "Edge", "Application", "msedge.exe"),
    path.join(process.env.PROGRAMFILES || "", "Microsoft", "Edge", "Application", "msedge.exe"),
  ].filter(Boolean);

  return candidates.find((candidate) => existsSync(candidate));
}

const { chromium } = requireFromRuntime("playwright");
const server = await startPreviewServer({ root: projectRoot, port });
const executablePath = findBrowserExecutable();
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});

try {
  const page = await browser.newPage({ viewport: { width: 1240, height: 1754 } });

  await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: outputPath,
    format: "A5",
    printBackground: true,
    preferCSSPageSize: true,
  });

  console.log(`Saved ${outputPath}`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
