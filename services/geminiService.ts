
import { GoogleGenAI, Type } from "@google/genai";
import { Platform } from "../types";

// Always use the API key directly from process.env.API_KEY as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractProductMetadata = async (url: string) => {
  const prompt = `Extract product information from this URL: ${url}. 
  Return the name, estimated price, platform (Shopee, Lazada, Amazon, Tiki, or Other), and a high-quality placeholder image description.
  IMPORTANT: The product title must be concise and under 20 words.
  Be accurate as an e-commerce parser.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            price: { type: Type.STRING },
            platform: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["title", "price", "platform"],
        },
      },
    });

    // Use .text property directly instead of .text() method
    const jsonStr = response.text || '{}';
    const data = JSON.parse(jsonStr);
    
    // Normalize platform
    let detectedPlatform = Platform.OTHER;
    const lowerP = data.platform?.toLowerCase() || '';
    if (lowerP.includes('shopee')) detectedPlatform = Platform.SHOPEE;
    else if (lowerP.includes('lazada')) detectedPlatform = Platform.LAZADA;
    else if (lowerP.includes('amazon')) detectedPlatform = Platform.AMAZON;
    else if (lowerP.includes('tiki')) detectedPlatform = Platform.TIKI;

    return {
      title: data.title || "Unknown Product",
      price: data.price || "Contact for Price",
      platform: detectedPlatform,
      category: data.category || "General",
      imageUrl: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 100)}`,
      affiliateUrl: url
    };
  } catch (error) {
    console.error("Failed to extract metadata:", error);
    return null;
  }
};
