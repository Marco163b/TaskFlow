export interface QuoteResponse {
  quote: string;
  author: string;
}

export async function getMotivationalQuote(): Promise<QuoteResponse> {
  const response = await fetch('https://dummyjson.com/quotes/random');

  if (!response.ok) {
    throw new Error('Erro ao buscar frase');
  }

  const data = await response.json() as QuoteResponse;

  return data;
}