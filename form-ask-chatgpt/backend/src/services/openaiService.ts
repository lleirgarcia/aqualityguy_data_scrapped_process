import OpenAI from 'openai';

interface File {
    Key: string;
    Body: any;
}

interface OpenAIResponse {
    item: any;
    response: string;
}

export const getOpenAIResponse = async (question: string, files: File[]): Promise<OpenAIResponse[]> => {
    console.log("Generating OpenAI responses...");

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
    });

    const responses: OpenAIResponse[] = [];

    for (const file of files) {
        const items = file.Body; // Asumiendo que Body es un array de ítems

        for (const item of items) {
            const itemString = JSON.stringify(item, null, 2);

            const prompt = `
            You are a helpful assistant. Here is a question related to a specific item:
            Question: ${question}
            
            Here is the item:
            ${itemString}
            
            Please provide a detailed response based on the question and the item.
            
            Give me the response in Spanish!
            `;

            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4-turbo",
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 4096
                });

                const result = response.choices[0].message?.content || 'No response';
                console.log("Generated text:", result);
                responses.push({ item, response: result });
            } catch (error) {
                console.error("Error during API call:", error);
                throw new Error('Failed to get response from OpenAI');
            }
        }
    }

    return responses;
};
