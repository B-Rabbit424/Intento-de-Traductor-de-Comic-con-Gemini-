import { GoogleGenAI, Modality, Part } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function blobToGenerativePart(blob: Blob): Promise<Part> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
  return {
    inlineData: {
      data: base64,
      mimeType: blob.type
    }
  };
}

export async function translateImage(
  image: File,
  sourceLang: string,
  targetLang: string,
  cropBlob: Blob | null,
): Promise<string> {
  // Fix: Use a model that supports image editing.
  const model = 'gemini-2.5-flash-image';
  
  const imageBlob = cropBlob || image;
  const imagePart = await blobToGenerativePart(imageBlob);

  const prompt = `Your task is to act as an expert comic book translator. Translate all text in this image from ${sourceLang === 'auto' ? 'the original language (auto-detected)' : sourceLang} to ${targetLang}.
You must replace the original text with the translated text directly on the image.
It is critical to preserve the original art style, font, and text placement. Match the original text's appearance as closely as possible.
If no text is present in the image, return the original image without any changes.
Do not add any extra text, commentary, or watermarks. Just output the final translated image.
The user's original instruction was: "Reconoceras los textos o dialogos que lleguen a tener las imagenes, y las traduciras"
`;
  
  const contents = {
    parts: [
      imagePart,
      { text: prompt }
    ]
  };

  try {
    // Fix: Use generateContent with the correct config for image editing.
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
      }
    }
    
    throw new Error("Model did not return an image. It may have been blocked due to safety settings.");

  } catch (error) {
    console.error('Error translating image with Gemini:', error);
    if (error instanceof Error) {
        if (error.message.includes("SAFETY")) {
             throw new Error("Image translation was blocked due to safety policies. Please try a different image.");
        }
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image translation.");
  }
}
