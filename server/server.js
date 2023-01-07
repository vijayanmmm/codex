import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

console.log("API KEY",process.env.OPENAPI_API_KEY)

const configuration = new Configuration({
    apiKey: process.env.OPENAPI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',async(req,res)=>{
    res.status(200).send({
        message: 'Hello from CodeX',
    })
});

app.post('/',async(req,res)=>{
    try {
        const prompt = req.body.prompt;
        //limit only 100 letters if its more
        if (prompt.length > 100){
            prompt = prompt.substring(0,99)
        }
        console.log("Input Prompt:",prompt)

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot:response.data.choices[0].text
        });
    } catch (error) {
        console.log("error msg:",error.message)
        res.status(500).send({error})
    }
})

app.listen(5000,()=>console.log("Server is running on port http://localhost:5000"));