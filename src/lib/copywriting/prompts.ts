export interface PromptParams {
  language?: string;
  [key: string]: string | undefined;
}

type PromptBuilder = (params: PromptParams) => string;

const promptBuilders: Record<string, PromptBuilder> = {
  "keyword-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to generate some keywords based on the product information which I provided.
Return 10 results line by line in plain text, do not add explanations and notes.
The results must be in ${p.language}.
Following is the product information:
${p.commodityInformation}`,

  "listing-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write a high quality marketplace listing based on the following information.
The listing must include title, description and key features.
The key features must have 10 items in a bullet list.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Never wrap the result in code blocks.

Keywords: ${p.goodsKeywords}
Product name: ${p.productName}
Category: ${p.category}
Selling points: ${p.sellingPoints}`,

  "search-term-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to generate backend search terms based on the product information which I provided.
You need to generate some search terms that are not mentioned in the original text but are related to the product, and ensure that users can search for this product.

Following is the product information:
${p.commodityInformation}

You must perform these actions in ${p.language}:
1. Collect and list some information about the content, such as type, function or style
2. Generate variants about these content which are not mentioned in the original text
3. Generate 10 results line by line based on the variant info`,

  "product-description-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to generate 5 descriptions for ${p.platform} based on the product information which I provided.
Make sure the result is high quality and professional.
You must use ${p.language} to return results in plain text line by line, never add explanations and notes.

Following is the product information:
Title: ${p.productTitle}
Keywords: ${p.goodsKeywords}`,

  "title-optimization": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to generate 5 optimized titles for ${p.platform} based on the product information which I provided.
Make sure the result is high quality and professional.
You must use ${p.language} to return results in plain text line by line, never add explanations and notes.

Following is the product information:
${p.goodsKeywords}`,

  "product-description-optimization": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to optimize the product description for ${p.platform} based on the product information which I provided.
Make sure the result is high quality and professional.
You must use ${p.language} to return results in plain text.

Following is the product information:
Title: ${p.productTitle}
Keywords: ${p.goodsKeywords}
Description: ${p.productDescription}`,

  "listing-comparison": (p) => `You are a helpful assistant which expert in E-Commerce.
Compare between the two product listings, and write a concise, professional report for marketing staff, listing the advantages and disadvantages of each.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Never wrap the result in code blocks.

Product A:
Title: ${p.productTitle_A}
Description: ${p.productDescription_A}
Key features:
${p.mainFeatures_A}

Product B:
Title: ${p.productTitle_B}
Description: ${p.productDescription_B}
Key features:
${p.mainFeatures_B}`,

  "listing-optimization": (p) => `You are a helpful assistant which expert in E-Commerce.
Read the product listing which I provided, and then generate an optimized version.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Never wrap the result in code blocks.

Title: ${p.productTitle}
Description: ${p.productDescription}
Key features:
${p.mainFeatures}`,

  "keyword-expansion": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to generate 10 variant keywords related to the original product based on the product information which I provided.
Make sure the result is high quality and professional.
You must use ${p.language} to return results in plain text line by line, never add notes.

Following are the original keywords:
${p.goodsKeywords}`,

  "title-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to generate 10 product titles for ${p.platform} based on the product information which I provided.
Make sure the result is high quality and professional.
The result language must be ${p.language}.
You must return results in plain text line by line, never add explanations and notes.

Product name:
${p.productName}

Brand:
${p.brand}

Selling points:
${p.coreSellingPoints}

Keywords:
${p.goodsKeywords}`,

  "tag-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to generate 10 related hashtags based on the product information which I provided.
You must use ${p.language} to return results in plain text line by line, never add explanations and notes.

Product information:
${p.commodityInformation}`,

  "tag-extraction": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to extract related hashtags based on the product information which I provided.
You must use ${p.language} to return results in plain text line by line, never add explanations and notes.

Title: ${p.productTitle}
Description: ${p.productDescription}`,

  "keyword-extraction": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to extract keywords from the product listing which I provided.

Product listing:
${p.productListing}

List the keywords in ${p.language} line by line, do not add other content.`,

  "customer-review-analysis": (p) => `You are a helpful assistant which expert in E-Commerce.
Your task is to analyse the customer reviews and generate a concise report based on what I provided.
You must use ${p.language} to return results in plain text, never add explanations and notes.

Reviews:
${p.comment}`,

  "inquiry-email-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Generate an inquiry email based on the information which I provided.
Make sure the result is high quality and friendly.
You must use ${p.language} to write the result in plain text format, never add explanations, greetings or notes.

Product name: ${p.productName}
Planning order quantity: ${p.orderQuantity}
My company name: ${p.yourName_companyName}`,

  "model-analysis-suggestions": (p) => `You are a helpful assistant which expert in E-Commerce.
Read the product information which I provided, and then write a modification suggestion report to help me improve market competitiveness.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Never wrap the result in code blocks.

Title: ${p.productTitle}
Description: ${p.productDescription}
Key features:
${p.mainFeatures}`,

  "keyword-recommendations": (p) => `You are a helpful assistant which expert in E-Commerce.
Suggest some keywords for my product based on the following information.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text line by line, never add explanations, greetings or notes.
Return 20 results.

Product name: ${p.productName}
Keyword type: ${p.goodsKeywords}`,

  "listing-analysis": (p) => `You are a helpful assistant which expert in E-Commerce.
Read the product listing which I provided, and then write a concise analysis report.
Add some suggestions for the listing.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Never wrap the result in code blocks.

Title: ${p.productTitle}
Description: ${p.productDescription}
Key features:
${p.mainFeatures}`,

  "user-profile-analysis": (p) => `You are a helpful assistant which expert in E-Commerce.
Write a professional target user profile analysis report based on my input text.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Never wrap the result in code blocks.

Target user:
${p.targetUser}`,

  "email-reply-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write me an email reply to my customer based on the information I provided.
You must follow my topic to write the email; the email must be professional, friendly, concise and high quality.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text, never add explanations, greetings or notes.

Customer Email Content:
${p.customerEmailContent}
Response topic: ${p.responseTopic}
Customer name: ${p.customerName}
Customer service name: ${p.customerServiceName}`,

  "after-sales-email-reply-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write me an after-sales email reply to my customer based on the information I provided.
You must follow my topic to write the email; the email must be professional, friendly, concise and high quality.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text, never add explanations, greetings or notes.

Customer Email Content:
${p.customerEmailContent}`,

  "review-reply-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write me a review reply to my customer based on the information I provided.
The reply must be professional, friendly, concise and high quality.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text, never add explanations, greetings or notes.

Review:
${p.comment}`,

  "negative-review-reply-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write me a negative-review reply to my customer based on the information I provided.
The reply must be professional, friendly, concise and high quality.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text, never add explanations, greetings or notes.

Negative review:
${p.comment}
Response topic: ${p.expectedResponse}`,

  "buyer-message-reply-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write me a buyer-message reply to my customer based on the information I provided.
The reply must be professional, friendly, concise and high quality.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text, never add explanations, greetings or notes.

Buyer message:
${p.comment}
Response topic: ${p.expectedResponse}`,

  "ad-title-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write me 10 ad titles based on the information I provided. The titles must be creative, eye-catching, interesting and attract users to consume.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text line by line, never add explanations, greetings or notes.

Product name: ${p.productName}
Target user: ${p.targetUser}`,

  "review-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write me 10 user comments for my product based on the information I provided. The comments must be realistic, objective and reliable.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text line by line, never add explanations, greetings or notes.

Product name: ${p.productName}
Brand: ${p.brand}`,

  "post-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write me a product post for the title and SEO description I provided. The post must be professional, easy to understand, eye-catching and creative.

Title: ${p.title}
Description: ${p.description}

You must write the post in your own words; you must use ${p.language} to write it, making sure it is professional and fluent.
The format must be markdown, do not add any other content. Do not wrap the result in code blocks.`,

  "popular-term-recommendations": (p) => `You are a helpful assistant which expert in E-Commerce.
Based on the product description, recommend 10 new keywords which are related and more popular. The new results can be terms not mentioned in the input text.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text line by line, never add explanations, greetings or notes.

Description: ${p.description}`,

  "promotion-suggestions": (p) => `You are a helpful assistant which expert in E-Commerce.
Write a detailed promotion suggestion for my product.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Do not wrap the result in code blocks.

Product: ${p.productName}`,

  "product-promotion-invitation-letter-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write a cooperation invite email for KOL/influencer sales based on the information which I provided.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Do not wrap the result in code blocks.

Store name: ${p.storeName}
Product: ${p.products}`,

  "marketing-email-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write a marketing email based on the information which I provided.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Do not wrap the result in code blocks.

Product name: ${p.productName}
Key features:
${p.keyFeatures}`,

  "case-study-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write a case study based on the information which I provided.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Do not wrap the result in code blocks.

Customer name: ${p.customerName}
Product name or Brand: ${p.productNameOrBrand}`,

  "foreign-trade-development-letter-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write a foreign trade development email based on the information which I provided.
You must follow my goal to write the email; the email must be professional, friendly and high quality.
Always return in ${p.language}, or translate to the target language if needed.
The format must be markdown, never add explanations, greetings or notes.
Do not wrap the result in code blocks.

Receiver: ${p.receiver}
Goal: ${p.goal}
Product and company information:
${p.productAndCompanyInformation}`,

  "product-introduction-generation": (p) => `You are a helpful assistant which expert in E-Commerce.
Write a high quality product introduction based on the keywords which I provided.
The result must be professional, eye-catching and creative.
Always return in ${p.language}, or translate to the target language if needed.
The format must be plain text, never add explanations, greetings or notes.

Keywords:
${p.keywords}`,
};

export function buildPrompt(toolSlug: string, params: PromptParams): string | null {
  const builder = promptBuilders[toolSlug];
  if (!builder) return null;
  return builder({ ...params, language: params.language ?? "English" });
}
