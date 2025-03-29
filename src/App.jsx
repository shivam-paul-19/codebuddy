import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";
import { useState } from "react";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

import CircularProgress from "@mui/material/CircularProgress";
import GitHubIcon from "@mui/icons-material/GitHub";
import Tooltip from "@mui/material/Tooltip";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  let [response, setResponse] = useState("");
  let [isLoad, setIsLoad] = useState(false);
  let [lang, setLang] = useState("");

  const getQuestion = async (event) => {
    event.preventDefault();
    console.log(event);
    let url = event.target[0].value;
    setLang(event.target[2].value);
    await getResponse(url, event.target[2].value);
  };

  const getResponse = async (prompt, lang) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    prompt = `give answer of this question in ${lang}: ${prompt}
              the structure should be like this:
              - Name of the question as heading
              - question explanation (in plain text, not code)
              - Data structures that are used in it
              - Optimised code in ${lang} (use subtle comments, and make sure to add class "Solution" if it is an object oriented language)
              - dry run
              - time and space complexity
              - Other approaches that can be used (No need to write and code here)`;

    setIsLoad(true);
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    setIsLoad(false);
    setResponse(response);
  };

  const copyCode = async () => {
    let start = response.indexOf(`\`\`\`${lang.toLowerCase()}`);
    let end = response.lastIndexOf("```");
    let code = response
      .substring(start, end)
      .replace(`\`\`\`${lang.toLowerCase()}`, "");
    await navigator.clipboard.writeText(code);
  };

  const copyWhole = async () => {
    await navigator.clipboard.writeText(response);
  };

  return (
    <div className="main-body">
      <a href="https://github.com/shivam-paul-19/codebuddy" target="_blank">
        <Tooltip title="GitHub Repository">
          <GitHubIcon
            sx={{
              position: "absolute",
              fontSize: "35px",
              top: "10px",
              color: "black",
              right: "25px",
            }}
          />
        </Tooltip>
      </a>

      <div className="heading">
        <h1>&lt;Code Buddy&gt;</h1>
      </div>
      <form action="" onSubmit={getQuestion}>
        <TextField
          id="outlined-basic"
          label="Enter the link of the question"
          variant="outlined"
          required
          sx={{
            width: "400px",
            border: "2px solid black",
            borderRadius: "10px",
          }}
        />
        <br />
        <div className="but-lang">
          <FormControl
            sx={{
              width: "120px",
              border: "2px solid black",
              borderRadius: "10px",
            }}
          >
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              required
              sx={{
                color: "black",
              }}
            >
              <MenuItem value={"java"}>Java</MenuItem>
              <MenuItem value={"Cpp"}>C++</MenuItem>
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
          {!isLoad ? (
            <Button
              sx={{
                height: "70%",
                backgroundColor: "#481D24",
                color: "white",
              }}
              variant="contained"
              type="submit"
            >
              Solve
            </Button>
          ) : (
            <Button
              sx={{
                height: "70%",
                backgroundColor: "black",
                color: "white",
              }}
              variant="contained"
              disabled
            >
              Solve
            </Button>
          )}
        </div>
      </form>
      {isLoad ? (
        <div
          className="response-box"
          style={{
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "white" }} />
          <p>Solving your question... It may take some seconds</p>
        </div>
      ) : null}
      {response != "" ? (
        <>
          <br />
          <div
            style={{
              margin: "10px",
              display: "flex",
              justifyContent: "start",
              width: "60%",
              // backgroundColor: "yellow"
            }}
          >
            <Button
              sx={{ color: "white", backgroundColor: "#481D24" }}
              onClick={copyCode}
            >
              Copy Code
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              sx={{ color: "#481D24", backgroundColor: "white" }}
              onClick={copyWhole}
            >
              Copy whole response
            </Button>
          </div>
          <div
            className="response-box"
            dangerouslySetInnerHTML={{ __html: `${marked(response)}` }}
          ></div>
        </>
      ) : null}
      {response != "" && !isLoad ? (
        <div className="response-box">
          <b>Disclaimer: </b>CodeBuddy provides AI-generated solutions,
          explanations, and analyses, which may not always be accurate or
          complete. While we strive for helpful and reliable information, users
          should verify the content and use their judgment. CodeBuddy is not
          responsible for any errors or consequences arising from the use of
          AI-generated responses.
        </div>
      ) : null}
    </div>
  );
}

export default App;