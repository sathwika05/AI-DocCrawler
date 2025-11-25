import {PromptTemplate} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {RunnableSequence} from "@langchain/core/runnables";
import * as bedrock from "@langchain/aws";
import * as claude from "@langchain/anthropic";

dotenv.config();

await personalisedPitch("GenerativeAI","Javascript Developer",100);

async function personalisedPitch(
    course: string,
    role: string,
    wordLimit: number
){

const promptTemplate=new PromptTemplate({
    template: "Describe the importance of learning {course} for a {role}. Limit the output to {wordLimit} words.",
    inputVariables: ["course","role","wordLimit"],
});

const formattedPrompt = await promptTemplate.format({
    course,
    role,
    wordLimit,
})

console.log("Formatted Prompt: ",formattedPrompt);

// const llm=new ChatOpenAI({//temperature: 1
// //topP: 1,
//  maxTokens: 150,
// model:"gpt-3.5-turbo"});


const llm=new claude.ChatAnthropic({maxTokens: 150,
model:"claude-3-7-sonnet-20250219",
temperature: 0.7,    
});

//  const llm = new bedrock.ChatBedrockConverse({
//   model: "meta.llama3-70b-instruct-v1:0",
//   maxTokens: 150,
//   topP: 0.7,
//   region:"us-east-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey:process.env.AWS_ACCESS_KEY_SECRET!,
//   }  
//  });



const outputParser= new StringOutputParser();

// //option 1- Langchain Legacy Chain


// const legacyLlmChain = new();

//option 2- LCEL

//const lcelChain = promptTemplate.pipe(llm).pipe(outputParser);

const lcelChain=RunnableSequence.from([promptTemplate,llm,outputParser]);

const lcelResponse = await lcelChain.invoke({course,role,wordLimit});

console.log("Answer from LCEL chain: ", lcelResponse);




}

