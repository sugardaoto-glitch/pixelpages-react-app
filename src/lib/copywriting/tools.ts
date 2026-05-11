import { PLATFORMS, type LanguageOption } from "./languages";

export type FieldType = "Input" | "Textarea" | "Select";

export interface ToolField {
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: LanguageOption[];
  isBig?: boolean;
}

export type ToolFields = Record<string, ToolField>;

export interface Tool {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  submitLabel: string;
  resultType: "text" | "markdown";
  fields: ToolFields;
}

export const CATEGORIES = [
  "Products",
  "Marketing",
  "Customer Service",
  "Advertising",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

const platformField: ToolField = {
  type: "Select",
  label: "Platform",
  placeholder: "Select a platform",
  options: PLATFORMS,
};

export const TOOLS: Tool[] = [
  // Products
  {
    id: "products-keyword-generation",
    slug: "keyword-generation",
    name: "Keyword Generation",
    category: "Products",
    description:
      "Generate suitable keywords based on product information to improve discoverability.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      commodityInformation: {
        type: "Textarea",
        label: "Product Information",
        placeholder: "Describe the product (features, materials, audience...)",
      },
    },
  },
  {
    id: "products-listing-generation",
    slug: "listing-generation",
    name: "Listing Generation",
    category: "Products",
    description:
      "Quickly generate a high-quality product listing (title, description, key features).",
    submitLabel: "Generate",
    resultType: "markdown",
    fields: {
      goodsKeywords: {
        type: "Textarea",
        label: "Product Keywords",
        placeholder: "Comma-separated keywords",
      },
      productName: {
        type: "Input",
        label: "Product Name",
        placeholder: "e.g. Wireless Bluetooth Earbuds",
      },
      category: {
        type: "Input",
        label: "Category",
        placeholder: "e.g. Electronics > Headphones",
      },
      sellingPoints: {
        type: "Textarea",
        label: "Selling Points",
        placeholder: "What makes this product stand out?",
      },
    },
  },
  {
    id: "products-search-term-generation",
    slug: "search-term-generation",
    name: "Search Term Generation",
    category: "Products",
    description:
      "Generate backend search terms to enhance search exposure on marketplaces.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      commodityInformation: {
        type: "Textarea",
        label: "Product Information",
        placeholder: "Describe the product",
      },
    },
  },
  {
    id: "products-product-description-generation",
    slug: "product-description-generation",
    name: "Product Description Generation",
    category: "Products",
    description:
      "Generate detailed product descriptions with high keyword density to attract customers.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      productTitle: { type: "Input", label: "Product Title" },
      goodsKeywords: { type: "Textarea", label: "Product Keywords" },
      platform: platformField,
    },
  },
  {
    id: "products-title-optimization",
    slug: "title-optimization",
    name: "Title Optimization",
    category: "Products",
    description: "Optimize listing titles to enhance search engine friendliness.",
    submitLabel: "Optimize",
    resultType: "text",
    fields: {
      goodsKeywords: { type: "Textarea", label: "Product Keywords" },
      platform: platformField,
    },
  },
  {
    id: "products-product-description-optimization",
    slug: "product-description-optimization",
    name: "Product Description Optimization",
    category: "Products",
    description: "Refine product descriptions to be more persuasive and compliant.",
    submitLabel: "Optimize",
    resultType: "text",
    fields: {
      productTitle: { type: "Input", label: "Product Title" },
      goodsKeywords: { type: "Textarea", label: "Product Keywords" },
      productDescription: {
        type: "Textarea",
        label: "Product Description",
      },
      platform: platformField,
    },
  },
  {
    id: "products-listing-comparison",
    slug: "listing-comparison",
    name: "Listing Comparison",
    category: "Products",
    description: "Compare two listings and identify the best strategy.",
    submitLabel: "Compare",
    resultType: "markdown",
    fields: {
      productTitle_A: { type: "Input", label: "Product A Title" },
      productDescription_A: {
        type: "Textarea",
        label: "Product A Description",
      },
      mainFeatures_A: {
        type: "Textarea",
        label: "Product A Main Features",
        isBig: true,
      },
      productTitle_B: { type: "Input", label: "Product B Title" },
      productDescription_B: {
        type: "Textarea",
        label: "Product B Description",
      },
      mainFeatures_B: {
        type: "Textarea",
        label: "Product B Main Features",
        isBig: true,
      },
    },
  },
  {
    id: "products-listing-optimization",
    slug: "listing-optimization",
    name: "Listing Optimization",
    category: "Products",
    description: "Optimize a product listing as a whole to improve rankings.",
    submitLabel: "Optimize",
    resultType: "markdown",
    fields: {
      productTitle: { type: "Input", label: "Product Title" },
      productDescription: {
        type: "Textarea",
        label: "Product Description",
      },
      mainFeatures: {
        type: "Textarea",
        label: "Main Features",
        isBig: true,
      },
    },
  },
  {
    id: "products-keyword-expansion",
    slug: "keyword-expansion",
    name: "Keyword Expansion",
    category: "Products",
    description: "Expand related keywords to cover more traffic.",
    submitLabel: "Expand",
    resultType: "text",
    fields: {
      goodsKeywords: { type: "Textarea", label: "Product Keywords" },
    },
  },
  {
    id: "products-title-generation",
    slug: "title-generation",
    name: "Title Generation",
    category: "Products",
    description: "Generate precise titles for products to attract customer attention.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      productName: { type: "Input", label: "Product Name" },
      brand: { type: "Input", label: "Brand" },
      coreSellingPoints: {
        type: "Textarea",
        label: "Core Selling Points",
      },
      platform: platformField,
      goodsKeywords: { type: "Textarea", label: "Product Keywords" },
    },
  },
  {
    id: "products-tag-generation",
    slug: "tag-generation",
    name: "Tag Generation",
    category: "Products",
    description: "Automatically generate tags to increase product exposure.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      commodityInformation: {
        type: "Textarea",
        label: "Product Information",
        isBig: true,
      },
    },
  },
  {
    id: "products-tag-extraction",
    slug: "tag-extraction",
    name: "Tag Extraction",
    category: "Products",
    description: "Extract efficient tags from a listing to aid marketing.",
    submitLabel: "Extract",
    resultType: "text",
    fields: {
      productTitle: { type: "Input", label: "Product Title" },
      productDescription: {
        type: "Textarea",
        label: "Product Description",
      },
    },
  },
  {
    id: "products-keyword-extraction",
    slug: "keyword-extraction",
    name: "Keyword Extraction",
    category: "Products",
    description: "Extract effective keywords from text to enhance search performance.",
    submitLabel: "Extract",
    resultType: "text",
    fields: {
      productListing: {
        type: "Textarea",
        label: "Product Listing",
        isBig: true,
      },
    },
  },

  // Marketing
  {
    id: "marketing-model-analysis-suggestions",
    slug: "model-analysis-suggestions",
    name: "Model Analysis Suggestions",
    category: "Marketing",
    description: "Provide product modification analysis suggestions to optimize the product line.",
    submitLabel: "Suggest",
    resultType: "markdown",
    fields: {
      productTitle: { type: "Input", label: "Product Title" },
      productDescription: {
        type: "Textarea",
        label: "Product Description",
      },
      mainFeatures: {
        type: "Textarea",
        label: "Main Features",
        isBig: true,
      },
    },
  },
  {
    id: "marketing-keyword-recommendations",
    slug: "keyword-recommendations",
    name: "Keyword Recommendations",
    category: "Marketing",
    description: "Intelligently recommend efficient keywords to increase traffic.",
    submitLabel: "Recommend",
    resultType: "text",
    fields: {
      productName: { type: "Input", label: "Product Name" },
      goodsKeywords: { type: "Input", label: "Keyword Type" },
    },
  },
  {
    id: "marketing-listing-analysis",
    slug: "listing-analysis",
    name: "Listing Analysis",
    category: "Marketing",
    description: "Deeply analyze listing performance to discover optimization opportunities.",
    submitLabel: "Analyze",
    resultType: "markdown",
    fields: {
      productTitle: { type: "Input", label: "Product Title" },
      productDescription: {
        type: "Textarea",
        label: "Product Description",
      },
      mainFeatures: {
        type: "Textarea",
        label: "Main Features",
        isBig: true,
      },
    },
  },
  {
    id: "marketing-user-profile-analysis",
    slug: "user-profile-analysis",
    name: "User Profile Analysis",
    category: "Marketing",
    description: "Analyze user profiles based on data to accurately target customers.",
    submitLabel: "Analyze",
    resultType: "markdown",
    fields: {
      targetUser: { type: "Textarea", label: "Target User" },
    },
  },

  // Customer Service
  {
    id: "service-customer-review-analysis",
    slug: "customer-review-analysis",
    name: "Customer Review Analysis",
    category: "Customer Service",
    description: "Analyze customer reviews to gain insights into user needs.",
    submitLabel: "Analyze",
    resultType: "text",
    fields: {
      comment: { type: "Textarea", label: "Reviews", isBig: true },
    },
  },
  {
    id: "service-email-reply-generation",
    slug: "email-reply-generation",
    name: "Email Reply Generation",
    category: "Customer Service",
    description: "Automatically generate email replies to enhance after-sales service efficiency.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      customerEmailContent: {
        type: "Textarea",
        label: "Customer Email Content",
        isBig: true,
      },
      responseTopic: { type: "Input", label: "Response Topic" },
      customerName: { type: "Input", label: "Customer Name" },
      customerServiceName: {
        type: "Input",
        label: "Customer Service Name",
      },
    },
  },
  {
    id: "service-after-sales-email-reply-generation",
    slug: "after-sales-email-reply-generation",
    name: "After-sales Email Reply Generation",
    category: "Customer Service",
    description: "Generate after-sales email replies to improve customer satisfaction.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      customerEmailContent: {
        type: "Textarea",
        label: "Customer Email Content",
        isBig: true,
      },
    },
  },
  {
    id: "service-review-reply-generation",
    slug: "review-reply-generation",
    name: "Review Reply Generation",
    category: "Customer Service",
    description: "Generate suitable replies for customer reviews to increase interaction.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      comment: { type: "Textarea", label: "Review" },
    },
  },
  {
    id: "service-negative-review-reply-generation",
    slug: "negative-review-reply-generation",
    name: "Negative Review Reply Generation",
    category: "Customer Service",
    description: "Generate negative review replies to properly handle customer issues.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      comment: { type: "Textarea", label: "Negative Review" },
      expectedResponse: { type: "Input", label: "Expected Response" },
    },
  },
  {
    id: "service-buyer-message-reply-generation",
    slug: "buyer-message-reply-generation",
    name: "Buyer Message Reply Generation",
    category: "Customer Service",
    description: "Quickly generate buyer message replies to improve response speed.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      comment: { type: "Textarea", label: "Buyer Message" },
      expectedResponse: { type: "Input", label: "Expected Response" },
    },
  },

  // Advertising
  {
    id: "advertising-ad-title-generation",
    slug: "ad-title-generation",
    name: "Ad Title Generation",
    category: "Advertising",
    description: "Generate eye-catching ad titles to increase click-through rates.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      productName: { type: "Textarea", label: "Product Name" },
      targetUser: { type: "Input", label: "Target User" },
    },
  },
  {
    id: "advertising-review-generation",
    slug: "review-generation",
    name: "Review Generation",
    category: "Advertising",
    description: "Automatically generate customer reviews to increase social trust.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      productName: { type: "Textarea", label: "Product Name" },
      brand: { type: "Input", label: "Brand" },
    },
  },
  {
    id: "advertising-post-generation",
    slug: "post-generation",
    name: "Post Generation",
    category: "Advertising",
    description: "Quickly generate social media posts to enhance brand exposure.",
    submitLabel: "Generate",
    resultType: "markdown",
    fields: {
      title: { type: "Input", label: "Title" },
      description: { type: "Textarea", label: "Description" },
    },
  },
  {
    id: "advertising-popular-term-recommendations",
    slug: "popular-term-recommendations",
    name: "Popular Term Recommendations",
    category: "Advertising",
    description: "Recommend current popular vocabulary to keep up with trends.",
    submitLabel: "Recommend",
    resultType: "text",
    fields: {
      description: { type: "Textarea", label: "Description" },
    },
  },
  {
    id: "advertising-promotion-suggestions",
    slug: "promotion-suggestions",
    name: "Promotion Suggestions",
    category: "Advertising",
    description: "Provide effective promotion suggestions to improve marketing effectiveness.",
    submitLabel: "Suggest",
    resultType: "markdown",
    fields: {
      productName: { type: "Textarea", label: "Product Name" },
    },
  },

  // Other
  {
    id: "other-inquiry-email-generation",
    slug: "inquiry-email-generation",
    name: "Inquiry Email Generation",
    category: "Other",
    description: "Automatically generate inquiry emails to improve communication efficiency.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      productName: { type: "Input", label: "Product Name" },
      orderQuantity: { type: "Input", label: "Order Quantity" },
      yourName_companyName: {
        type: "Input",
        label: "Your Name / Company Name",
      },
    },
  },
  {
    id: "other-product-promotion-invitation-letter-generation",
    slug: "product-promotion-invitation-letter-generation",
    name: "KOL Invitation Letter Generation",
    category: "Other",
    description: "Generate KOL collaboration invitation letters to increase cooperation opportunities.",
    submitLabel: "Generate",
    resultType: "markdown",
    fields: {
      storeName: { type: "Input", label: "Store Name" },
      products: { type: "Textarea", label: "Products" },
    },
  },
  {
    id: "other-marketing-email-generation",
    slug: "marketing-email-generation",
    name: "Marketing Email Generation",
    category: "Other",
    description: "Generate precise marketing emails to aid promotional activities.",
    submitLabel: "Generate",
    resultType: "markdown",
    fields: {
      productName: { type: "Input", label: "Product Name" },
      keyFeatures: { type: "Textarea", label: "Key Features" },
    },
  },
  {
    id: "other-case-study-generation",
    slug: "case-study-generation",
    name: "Case Study Generation",
    category: "Other",
    description: "Automatically generate case studies to showcase product advantages.",
    submitLabel: "Generate",
    resultType: "markdown",
    fields: {
      customerName: { type: "Input", label: "Customer Name" },
      productNameOrBrand: {
        type: "Textarea",
        label: "Product Name or Brand",
      },
    },
  },
  {
    id: "other-foreign-trade-development-letter-generation",
    slug: "foreign-trade-development-letter-generation",
    name: "Foreign Trade Development Letter Generation",
    category: "Other",
    description: "Generate foreign trade development letters to explore more markets.",
    submitLabel: "Generate",
    resultType: "markdown",
    fields: {
      receiver: { type: "Input", label: "Receiver" },
      goal: { type: "Input", label: "Goal" },
      productAndCompanyInformation: {
        type: "Textarea",
        label: "Product and Company Information",
        isBig: true,
      },
    },
  },
  {
    id: "other-product-introduction-generation",
    slug: "product-introduction-generation",
    name: "Product Introduction Generation",
    category: "Other",
    description: "Generate detailed product introductions to enhance user conversion.",
    submitLabel: "Generate",
    resultType: "text",
    fields: {
      keywords: { type: "Textarea", label: "Keywords" },
    },
  },
];

const TOOL_BY_SLUG = new Map<string, Tool>(TOOLS.map((tool) => [tool.slug, tool]));

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOL_BY_SLUG.get(slug);
}

export function getToolsByCategory(category: Category): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}
