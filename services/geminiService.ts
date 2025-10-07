import { GoogleGenAI, Type } from "@google/genai";
import { ScannedMedication } from '../types';

// Inicializa como nulo para evitar que o app trave na inicialização
// se a API_KEY não estiver configurada no ambiente de produção (Vercel).
let ai: GoogleGenAI | null = null;

const getAiInstance = (): GoogleGenAI => {
    // Se a instância já foi criada, a retorna.
    if (ai) {
        return ai;
    }
    
    // Verifica se a variável de ambiente existe.
    if (process.env.API_KEY) {
        // Cria a instância apenas na primeira vez que for necessária.
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        return ai;
    }
    
    // Se a chave não existir, lança um erro claro que pode ser tratado na UI.
    throw new Error("A chave da API do Google Gemini não está configurada no ambiente.");
};

const parsePrescriptionPrompt = `
You are an expert medical assistant. Your task is to accurately extract medication details from an image of a medical prescription.
Analyze the provided image and identify all medications listed. For each medication, extract the following information:
1.  **medicationName**: The name of the drug.
2.  **dosage**: The prescribed amount per dose (e.g., "500mg", "1 comprimido").
3.  **frequency**: How often the medication should be taken (e.g., "a cada 8 horas", "1 vez ao dia").

Return the information as a JSON array of objects, where each object represents one medication.
If the image is not a valid prescription or is unreadable, return an empty array.
Do not invent information. Only extract what is clearly visible.
`;

export const parsePrescription = async (base64Image: string): Promise<ScannedMedication[]> => {
  try {
    // Obtém a instância da IA. Isso lançará um erro se a chave não estiver configurada.
    const gemini = getAiInstance();

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image,
      },
    };
    
    const textPart = {
        text: parsePrescriptionPrompt,
    };

    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              medicationName: {
                type: Type.STRING,
                description: 'O nome do medicamento.',
              },
              dosage: {
                type: Type.STRING,
                description: 'A dosagem do medicamento (ex: 500mg, 1 comprimido).',
              },
              frequency: {
                type: Type.STRING,
                description: 'A frequência que o medicamento deve ser tomado (ex: a cada 8 horas).',
              },
            },
            required: ["medicationName", "dosage", "frequency"]
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);
    
    if (Array.isArray(parsedData)) {
      return parsedData;
    }
    return [];

  } catch (error: any) {
    console.error("Error parsing prescription with Gemini:", error);
    // Propaga a mensagem de erro para ser exibida na interface do usuário.
    throw new Error(error.message || "Não foi possível analisar a receita. Tente novamente com uma imagem mais nítida.");
  }
};