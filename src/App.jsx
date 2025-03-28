import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import { useState } from "react";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from '@mui/material/Button';

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  let [response, setResponse] = useState("");

  const getQuestion = async (event) => {
    event.preventDefault();
    console.log(event);
    let url = event.target[0].value;
    let lang = event.target[2].value;
    let quest = url.split("/");
    if (quest[2] != "leetcode.com") {
      console.log("sorry");
      return;
    }

    console.log(lang)
    console.log("solving your question.....wait");
    let res = await getResponse(url, lang);
    quest = quest[4].replaceAll("-", " ");
  };

  const getResponse = async (prompt, lang) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    prompt = `give answer of this question in ${lang}: ${prompt}
              the structure should be like this:
              - question explanation (in plain text, not code)
              - code in ${lang} (use subtle comments)
              - dry run
              - time and space complexity`;
    setResponse("## Solving your problem, it may take some seconds");
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    console.log(response);
    setResponse(response);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <h1>Code Buddy</h1>
      <h2>Your one stop solution for DSA problems</h2>
      <form action="" onSubmit={getQuestion} style={{
        display: "flex",
        width: "50%",
        justifyContent: "space-evenly",
        alignItems: "center"
      }}>
        <TextField
          id="outlined-basic"
          label="Enter the link"
          variant="outlined"
          required
          sx={{
            width: "400px",
          }}
        />
        
          <FormControl sx={{
            width: "120px",
          }}>
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              required
              sx={{
                color: "black"
              }}
            >
              <MenuItem value={"java"}>Java</MenuItem>
              <MenuItem value={"C++"}>C++</MenuItem>
              <MenuItem value={"C"}>C</MenuItem>
              <MenuItem value={"Python"}>Python</MenuItem>
              <MenuItem value={"javascript"}>JavaScript</MenuItem>
              <MenuItem value={"typescript"}>TypeScript</MenuItem>
              <MenuItem value={"C#"}>C#</MenuItem>
              <MenuItem value={"Dart"}>Dart</MenuItem>
              <MenuItem value={"Kotlin"}>Kotlin</MenuItem>
              <MenuItem value={"PHP"}>PHP</MenuItem>
            </Select>
          </FormControl>
        
        <Button sx={{
          height: "70%",
          backgroundColor: "black"
        }} variant="contained" type="submit">Solve</Button>
      </form>

      <div
        dangerouslySetInnerHTML={{ __html: `${marked(response)}` }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          // backgroundColor: "black",
          // color: "white",
          textAlign: "left",
          fontFamily: "sans-serif",
        }}
      ></div>
    </div>
  );
}

export default App;
