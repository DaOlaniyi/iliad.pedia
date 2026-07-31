import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './App.module.css'
import Book from './Book'
import HomerIcon from "./assets/Homer.png"
import EditIcon from "./assets/EditIcon.svg"
import { motion } from "motion/react"

export type SetPageFunc = (t:string, b: string) => void;

type Article = {
    title : string,
    biography : string
}
//Enum to determine whether user is viewing or editing
enum TextState {Viewing="VIEWING", Editing="EDITING"}
  
function App() {

  useEffect(() => {
  GetBackendStatus();//Determine backend status
  }, []);   

  //Variables for existing Pages (title and biography)
  const [InfoTitle,SetTitle] = useState<string>("click something");
  const [InfoBio,SetBio] = useState<string>("...");

  //Variables for user-created Pages (title and biography)
  const [CustomTitle, CT_Setter] = useState<string>();//
  const [CustomBio, CB_Setter] = useState<string>();
  const [BioState,SetBioState] = useState<TextState>(TextState.Viewing);

  //Variables for fetched data
  const [BackendStatus, SetBackendStatus] = useState<string>("Inactive");
  const [ArticleMap, SetArticleMap] = useState<Map<string, string>>(new Map());
  const [BookUpdate,SetBookUpdate] = useState<(articles:Map<string,string>)=>void>();

  //Variables for Selection Panel
  const [SelectionNumber,SetSelectionNumber] = useState<number>(1);
  
  const [EditedBio, SetEditedBio] = useState<string>();

  //Setter functions for input texts, used for rule validation (title and biography)
  const SetCustomTitle = ((s:string) => {
    CT_Setter(s);
  })

    const SetCustomBio = ((s:string) => {
    CB_Setter(s);
  })

  //Setter function for info page
  const SetInfoPage = useCallback((t:string, b:string) => {
    const uppercasedTitle = t.charAt(0).toUpperCase() +t.slice(1);
    SetBioState(TextState.Viewing); // Switch back to reading if a new article is selected
    SetTitle(uppercasedTitle);
    SetBio(b);
  },[]);

  //Limiter to bound Selection number between 1 - 24.
  function NumberLimiter(e : any, min:number){
    if(e.target.value < min)
      {
      SetSelectionNumber(1);
    }
    else if(e.target.value > 24){
            SetSelectionNumber(24);
    }else {
      SetSelectionNumber(e.target.value);
    }
}

/*Book.tsx passes app its update method.
 Once the method is received, the articles are fetched from the server.  
 The articles are passed into the Book's UpdateMethod, creating the pages
*/
const Register = useCallback((UpdateMethod:(articles:Map<string,string>)=>void)=> {
  console.log("book registered: " , UpdateMethod);
  GetArticles(UpdateMethod);
  SetBookUpdate(() => UpdateMethod);
},[])

//Fetcher that retrieves articles JSON from servers
const GetArticles = async (UpdateBookMethod:(articles:Map<string,string>)=>void) => {
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

//Fetcher that retrieves articles JSON from servers
const EditArticle = async () => {
  try {

    if(EditedBio==null) {
      alert("Please include a biography the article you are editing" );
      return
    };
    const res = await fetch("http://localhost:8080/api/editarticle", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ "title": InfoTitle, "bio": EditedBio })
    })

    const data = await res.json();
    const phpResponse = JSON.parse(data.result);//parse JSON
    alert("Article Updated, result: " +  phpResponse.result);

    SetInfoPage(InfoTitle, EditedBio);
    console.log("Article Update SENT, result: " ,  phpResponse);
    SwitchBioState();

    const updatedArticles = ArticleMap.set(InfoTitle, EditedBio);
    SetArticleMap(ArticleMap.set(InfoTitle, EditedBio));
    if(BookUpdate) BookUpdate(updatedArticles);

  } catch (err) {
    console.error("Failed to reach backend:", err);
    alert("Could not reach backend – check console");
  }
};


//Fetcher that retrieves basic response from backend
const GetBackendStatus = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/health", {
      method: "GET",
      headers: { "Content-Type": "application/json"} })
    const data = await res.json();
    SetBackendStatus(data.status)
  } catch (err) {
    console.error("Failed to reach backend:", err);
    alert("Could not reach backend – check console");
  }
};

//Poster that sends user-created article title
const PostCustomArticle = async () => {

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
  } 
  catch (err) {
    console.error("Failed to reach backend:", err);
    alert("Could not reach backend – check console");
  }

  if(CustomTitle && CustomBio && BookUpdate){
    console.log("Quick update initiating..");
    const updatedMap = ArticleMap.set(CustomTitle, CustomBio);
    SetArticleMap(updatedMap);
    BookUpdate(updatedMap);
  }
  else
    {
      console.log(`Quick update failed: ${CustomTitle}, ${CustomBio}, ${BookUpdate}`);
    }

};

const SwitchBioState = ()=> {
  if(BioState == TextState.Viewing) 
  {
    SetBioState(TextState.Editing);
  }else{
     SetBioState(TextState.Viewing);
  }
}

const GetBio = ()=>{
  if(BioState == TextState.Viewing) 
  {
    return  <p>{InfoBio} </p>
  }else{
    return  (
    <>
    <textarea className = {styles.EditBioInput} defaultValue={InfoBio} onChange={(e) => SetEditedBio(e.target.value)}/> <br/>
    <label>publish as{" "}    </label>

    <select>
      <option>Anonymous</option>
      <option>My Account</option>
      </select><br/>
        <button onClick={EditArticle}>submit</button> 
    </>)
  }
}

 const BookProps = {
    Register: Register,
    SetInfo: SetInfoPage,
    ArticleMap: ArticleMap
  }

  return (
    <>
    <div className={styles.TopBanner}> 
      <div className={styles.TopLeftBannerGroup} >
      <motion.img className = {styles.CircleIcon} src = {HomerIcon} animate ={{rotate:360}}/>
    <p className={styles.MainTitle}>ILIAD.PEDIA</p> 
    <p className={styles.BannerText}>A free encyclopedia for humanity's greatest fiction</p>
    </div>
    <div className ={styles.TopRightBannerGroup}>
    <button className={styles.BannerButton}>Explore</button>
    <button className={styles.BannerButton}>About</button>
    <button className={styles.BannerButton}> Create Account</button>
    </div>
    </div>

    <div className={styles.MainWindow}>

      <div className={styles.BookContainer}>
          <Book props ={BookProps}/>
          <div className ={styles.SelectorPanel}>
            <b>Selection Options</b> <br/>
            Book <input className={styles.BookNumberInput} defaultValue={1} value = {SelectionNumber} onChange ={(e)=>{NumberLimiter(e, 0)}} onBlur={(e)=>NumberLimiter(e, 1)} type="number"></input>
            <button style={{marginLeft:"5px"}}>GO</button>
     
            </div>
      </div>
      
         <div className={styles.InfoPanel}>
          <div className={styles.bracket}>
            <div className={styles.InfoTitle}>
              {InfoTitle} 
              </div>
            <div className={styles.InfoText}> 
            {GetBio()}
                </div>
              </div>
              <img src={EditIcon} className={styles.EditIcon} onClick={SwitchBioState}/>
         </div>
    </div>

    <div className = {styles.BottomBanner}> 
      <p style ={{textAlign:"center"}}>Create New Page </p> <br/>
      <p>Title</p>
      <input className={styles.TitleInput} onChange={(e) => {SetCustomTitle(e.target.value)}} value = {CustomTitle} placeholder='eg. Achilles'></input> <br/>
      <p>Biography</p>
      <textarea className={styles.BioInput} onChange={(e) => {SetCustomBio(e.target.value)}} value = {CustomBio} placeholder='eg. Achilles was a great warrior'></textarea> 
      <button className = {styles.ArticleSubmit} onClick={PostCustomArticle}>Submit</button>
      <br/>
      <p>Backend Status: {BackendStatus}</p>
    </div>
     </>
  )


}




export default App
