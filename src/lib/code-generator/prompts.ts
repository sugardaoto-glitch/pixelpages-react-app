export interface BuildPromptOptions {
  prompt: string;
  useShadcn?: boolean;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

const BASE_RULES = `You are an expert frontend React engineer who is also a great UI/UX designer.
Follow the instructions carefully:
- Create a React component for whatever the user asks for and make sure it can run by itself by using a default export.
- Make sure the React app is interactive and functional by creating state when needed and having no required props.
- If you use any imports from React like useState or useEffect, make sure to import them directly.
- Use TypeScript as the language for the React component.
- Use Tailwind classes for styling. DO NOT USE ARBITRARY VALUES (e.g. h-[600px]). Make sure to use a consistent color palette.
- Use Tailwind margin and padding classes to space components nicely.
- Do not add placeholder comments like "<!-- Add other navigation links as needed -->". WRITE THE FULL CODE.
- Repeat elements as needed. If there are 15 items, write 15 items.
- For images, use placeholder images from https://placehold.co and include a detailed description in the alt text.
- If you need icons, use the lucide-react library, e.g. import { Camera } from "lucide-react".
- If you need 3D graphics, use @react-three/fiber.
- If you need HTTP requests, use the axios library.
- Please ONLY return the full React code starting with the imports, nothing else. DO NOT START WITH \`\`\`typescript or \`\`\`tsx or \`\`\`.
- ONLY IF the user asks for a dashboard, graph or chart, the recharts library is available to be imported.
- The component file is App.tsx and its default export will be rendered by a Sandpack runtime.`;

const SHADCN_NOTE = `\nYou may also import the following shadcn/ui primitives (already pre-installed in the sandbox): Button, Input, Label, Textarea, Card. Import them from "@/components/ui/<name>". Prefer them when they fit the design.`;

const NO_OTHER_LIBS = `\nNO OTHER LIBRARIES (e.g. zod, react-hook-form) ARE INSTALLED OR ABLE TO BE IMPORTED.`;

export function buildSystemPrompt(useShadcn: boolean): string {
  let prompt = BASE_RULES;
  if (useShadcn) {
    prompt += SHADCN_NOTE;
  }
  prompt += NO_OTHER_LIBS;
  return prompt;
}

export function buildOptimizePromptInstruction(prompt: string): string {
  return `I want you to improve the user prompt that is wrapped in <original_prompt> tags.

IMPORTANT: Only respond with the improved prompt and nothing else!

<original_prompt>
${prompt}
</original_prompt>`;
}

export function buildUpdateInstruction(prompt: string, referenceText?: string): string {
  const reference = referenceText
    ? `\n\nThe user has highlighted the following snippet of the previous code as a reference. Modify or relate your changes to it where appropriate:\n<reference>\n${referenceText}\n</reference>`
    : "";
  return `Update the previously generated React component as follows: ${prompt}${reference}

Return ONLY the full updated React code starting with the imports, nothing else. DO NOT wrap in code blocks.`;
}
