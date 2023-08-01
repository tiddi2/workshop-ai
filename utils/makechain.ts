import { LLMChain, PromptTemplate } from 'langchain';
import { ChatOpenAI } from 'langchain/chat_models/openai';

const PROMPT = `Vi skal leke 20 spørsmål. Ordet er {word}. Det ordet skal du skrive hvis det er første meldingen din og det skal da gis fargen: #f9fafb og skrives i din melding så det ikke synes mot bakgrunnen. Etter dette så er det jeg som stiller spørsmål og du som svarer. Det er altså du som tenker på ordet.

Samtalehistorikk: {context}.

Her er min melding:
{question}
 
Svar i markdown:`;

export const makeChain = async (
  question: string,
  history: [string, string][],
) => {
  let word;
  if(history.length === 0){
    const wordGeneratorModel = new ChatOpenAI({
      temperature: 1,
      azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
      azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION
    });
    const wordgeneratorPrompt = PromptTemplate.fromTemplate('Finn opp et ord til leken 20 spørsmål. Bruk produktet av alle sifrene som ikke er null i det følgende klokkeslettet til å assosiere deg til et tilfeldig ord: ' + Date.now() + ' . Sørg for at ordet er noe man bruker i dagliglivet også. Det skal være mulig å gjette seg til. Svar med en forklaring på hvordan du briukte sifrene til å komme på ordet.');
    const wordGeneratorChain = new LLMChain({llm: wordGeneratorModel, prompt: wordgeneratorPrompt});
    word = await wordGeneratorChain.call({});
    console.log(word);
  }
  const chat = new ChatOpenAI({
    temperature: 0,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION
  });

  const prompt = PromptTemplate.fromTemplate(PROMPT);
  
  const chain = new LLMChain({llm: chat, prompt});

  const res = await chain.call({
    word: word?.text,
    question,
    context: history
  });

  return res;
};