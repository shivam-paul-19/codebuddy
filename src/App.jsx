import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
  const getQuestion = async (event) => {
    event.preventDefault();
    let url = event.target[0].value
    let lang = event.target[1].value
    let quest = url.split('/')
    if(quest[2] != "leetcode.com") {
      console.log("sorry")
      return
    }
    console.log("solving your question.....wait")
    let res = await getResponse(url, lang)
    quest = quest[4].replaceAll('-', ' ')
    console.log(res)
  }

  const getResponse = async (prompt, lang) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    prompt = `give answer of this question in ${lang}: ${prompt}
              the structure should be like this:
              - question explanation (in plain text, not code)
              - code in ${lang} (use subtle comments)
              - dry run
              - time and space complexity`
    const result = await model.generateContent(prompt);
    let response = result.response.text();
    console.log(response)
  }

  return (
    <>
    <h1>Code Buddy</h1>
    <h2>Your one stop solution for DSA problems</h2>
    <form action="" onSubmit={getQuestion}>
    <label htmlFor="link">Enter the link</label>
    <input type="text" />
    <select name="" id="">
      <option value="java">Java</option>
      <option value="C++">C++</option>
      <option value="Python">Python</option>
      <option value="C">C</option>
      <option value="javascript">JavaScript</option>
      <option value="typescript">TypeScript</option>
      <option value="PHP">PHP</option>
      <option value="C#">C#</option>
      <option value="Dart">Dart</option>
      <option value="Kotlin">Kotlin</option>
    </select>
    <button type='submit'>Enter</button>
    </form>
    </>
  )
}

export default App
