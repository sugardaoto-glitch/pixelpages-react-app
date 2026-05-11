"use client";

import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";

import { MESSAGES } from "@/lib/code-generator/messages";

interface CodeSandboxProps {
  code: string;
  useShadcn: boolean;
  activeView: "preview" | "code";
}

const SHARED_TAILWIND = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

function buildFiles(code: string, useShadcn: boolean) {
  const files: Record<string, string> = {
    "/App.tsx": code,
    "/styles.css": SHARED_TAILWIND,
  };

  if (useShadcn) {
    files["/components/ui/button.tsx"] = `import * as React from "react";\n\nexport function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {\n  return (\n    <button\n      {...props}\n      className={\"rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 \" + (props.className ?? \"\")}\n    />\n  );\n}\n`;
    files["/components/ui/input.tsx"] = `import * as React from "react";\n\nexport function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {\n  return (\n    <input\n      {...props}\n      className={\"flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm \" + (props.className ?? \"\")}\n    />\n  );\n}\n`;
    files["/components/ui/textarea.tsx"] = `import * as React from "react";\n\nexport function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {\n  return (\n    <textarea\n      {...props}\n      className={\"flex min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm \" + (props.className ?? \"\")}\n    />\n  );\n}\n`;
    files["/components/ui/label.tsx"] = `import * as React from "react";\n\nexport function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {\n  return (\n    <label {...props} className={\"text-sm font-medium \" + (props.className ?? \"\")} />\n  );\n}\n`;
    files["/components/ui/card.tsx"] = `import * as React from "react";\n\nexport function Card(props: React.HTMLAttributes<HTMLDivElement>) {\n  return (\n    <div\n      {...props}\n      className={\"rounded-lg border border-slate-200 bg-white shadow-sm \" + (props.className ?? \"\")}\n    />\n  );\n}\n\nexport function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {\n  return <div {...props} className={\"flex flex-col space-y-1.5 p-6 \" + (props.className ?? \"\")} />;\n}\n\nexport function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {\n  return <h3 {...props} className={\"text-lg font-semibold leading-none \" + (props.className ?? \"\")} />;\n}\n\nexport function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {\n  return <div {...props} className={\"p-6 pt-0 \" + (props.className ?? \"\")} />;\n}\n`;
  }

  return files;
}

export function CodeSandbox({ code, useShadcn, activeView }: CodeSandboxProps) {
  const trimmed = code.trim();
  if (!trimmed) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
        {MESSAGES.resultEmpty}
      </div>
    );
  }

  const files = buildFiles(trimmed, useShadcn);

  return (
    <div className="h-full min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-white">
      <SandpackProvider
        key={String(useShadcn)}
        template="react-ts"
        files={files}
        customSetup={{
          dependencies: {
            "lucide-react": "^0.435.0",
            recharts: "^2.12.7",
          },
        }}
        options={{
          recompileMode: "delayed",
          recompileDelay: 300,
        }}
        theme="auto"
      >
        <SandpackLayout className="!h-full">
          {activeView === "code" ? (
            <SandpackCodeEditor
              showLineNumbers
              showInlineErrors
              wrapContent
              style={{ height: "calc(100vh - 280px)", minHeight: "420px" }}
            />
          ) : (
            <SandpackPreview
              showOpenInCodeSandbox={false}
              showRefreshButton
              style={{ height: "calc(100vh - 280px)", minHeight: "420px" }}
            />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
