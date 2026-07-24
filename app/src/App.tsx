import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import Book from './Book'
import HomerIcon from "./assets/Homer.png"
import EditIcon from "./assets/EditIcon.png"
export type SetPageFunc = (t:string, b: string) => void;

type Article = {
    title : string,
    biography : string
}

function App() {

  const [count, setCount] = useState(0)
  const [InfoBio,SetBio] = useState<string>("...");
  const [InfoTitle,SetTitle] = useState<string>("click something");
  const [BackendStatus, SetBackendStatus] = useState<string>("Inactive");
 const [ArticleMap, SetArticleMap] = useState<Map<string, string>>(new Map());

  const [CustomTitle, CT_Setter] = useState<string>();
  const [CustomBio, CB_Setter] = useState<string>();
  // const [BookUpdate,SetBookUpdate] = useState<(a:Map<string,string>)=>{}>();

  const SetCustomTitle = ((s:string) => {
    CT_Setter(s);
  })

    const SetCustomBio = ((s:string) => {
    CB_Setter(s);
  })

  const SetInfoPage = useCallback((t:string, b:string) => {
    SetTitle(t);
    SetBio(b);
  },[]);

/*Book.tsx passes app its update method.
 Once the method is received, the articles are fetched from the server.  
 The articles are passed into the Book's UpdateMethod, creating the pages
*/
const Register = useCallback((UpdateMethod:(articles:Map<string,string>)=>{})=> {
  console.log("book registered!");
  GetArticles(UpdateMethod);
},[])

const GetArticles = async (UpdateBookMethod:(articles:Map<string,string>)=>{}) => {
  try {
    const res = await fetch("http://localhost:8080/api/getarticles");
    const data = await res.json();
    const articles = JSON.parse(data.articles);//parse JSON
  
    //Create map of articles
    for(let i =0; i < articles.length; i++ ){
    SetArticleMap(ArticleMap.set(articles[i].title, articles[i].biography))
   }

    console.log("Articles Retrieved, updating book with: " ,  ArticleMap);

    //Give the articles to the book
   if(UpdateBookMethod) UpdateBookMethod(ArticleMap);

  } catch (err) {
    console.error("Failed to reach backend:", err);
    alert("Could not reach backend – check console");
  }
};

const GetBackendStatus = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/health");
    const data = await res.json();
    SetBackendStatus(data.status)
  } catch (err) {
    console.error("Failed to reach backend:", err);
    alert("Could not reach backend – check console");
  }
};

  const SubmitCustomArticle = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ "title": CustomTitle, "bio": CustomBio })
    })
    const data = await res.json();
    alert("Submission Result: " + data.message);
    SetCustomTitle("");
    SetCustomBio("");
  } catch (err) {
    console.error("Failed to reach backend:", err);
    alert("Could not reach backend – check console");
  }
};

useEffect(() => {
  GetBackendStatus();
}, []);  

 const BookProps = {
    Register: Register,
    SetInfo: SetInfoPage,
    ArticleMap: ArticleMap
  }


  return (
    <>
    <div className={styles.TopBanner}> 
      <img className = {styles.CircleIcon} src = {HomerIcon}/>
    <p className={styles.MainTitle}>ILIAD</p> <p className={styles.TitleSuffix}>.PEDIA</p>
    </div>

    <div className={styles.BookContainer}>
         <Book props ={BookProps}/>
         <div className={styles.InfoPanel}>
          <div className={styles.InfoTitle}>
            {InfoTitle} 
            <img src={EditIcon} className={styles.Icon}/>
            </div>
          <div className={styles.InfoText}> 
            <p>
              {InfoBio}
              </p>
              </div>
         </div>
    </div>

    <div className = {styles.BottomBanner}> 
      <p>Create Page </p> <br/>
      <p>Title</p>
      <input className={styles.TitleInput} onChange={(e) => {SetCustomTitle(e.target.value)}} value = {CustomTitle} placeholder='eg. Achilles'></input> <br/>
      <p>Biography</p>
      <textarea className={styles.BioInput} onChange={(e) => {SetCustomBio(e.target.value)}} value = {CustomBio} placeholder='eg. Achilles was a great warrior'></textarea> 
      <button className = {styles.ArticleSubmit} onClick={SubmitCustomArticle}>Submit</button>
      <br/>
      <p>Backend Status: {BackendStatus}</p>
    </div>
     </>
  )


}




export default App
