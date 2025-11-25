// Set the LANGSMITH_API_KEY environment variable (create key in Settings > API Keys)

// If you are in a non-Node environment, please use the default "langchain/hub" entrypoint and omit includeModel for providers other than OpenAI
import * as hub from "langchain/hub/node";
import {ChatOpenAI} from "@langchain/openai";
import {StringOutputParser} from "@langchain/core/output_parsers";
import {createRetriever} from "./retriever";
import {RunnableSequence} from "@langchain/core/runnables"
import { formatDocumentsAsString } from "langchain/util/document";
import { ChatHandler,chat } from "../utils/chat";

const ragPrompt=await hub.pull("rlm/rag-prompt", {
  includeModel: true
});

const llm = new ChatOpenAI({
model: "gpt-3.5-turbo",
maxTokens: 500
});

const outputParser= new StringOutputParser();

const retriever = await createRetriever();

const retrievalChain = RunnableSequence.from([
    (input)=>input.question,
    retriever,
    formatDocumentsAsString
]);

const generationChain = RunnableSequence.from([
{
    question: (input) => input.question,
    context: retrievalChain
},
ragPrompt,
llm,
outputParser
]);

const chatHandler: ChatHandler=async (question)=>{
    return {
        answer: generationChain.stream({
            question
        }),
    };
};

chat(chatHandler)