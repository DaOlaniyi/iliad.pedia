import { useCallback, useState } from 'react'
import styles from './App.module.css'
import Book from './Book'
import HomerIcon from "./assets/Homer.png"
import EditIcon from "./assets/EditIcon.png"
export type SetPageFunc = (t:string, b: string) => void;

function App() {
  const [count, setCount] = useState(0)
  const [InfoBio,SetBio] = useState<string>("...");
  const [InfoTitle,SetTitle] = useState<string>("click something");

  const SetB = useCallback((t:string, b:string) => {
    SetTitle(t);
    SetBio(b);
  },[])
  const props = {
    func: SetB,
    message: "hello world"
  }

//   fetch("http://localhost:8080/api/articles", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ title, bio })
// })

  return (
    <>
    <div className={styles.TopBanner}> 
      <img className = {styles.CircleIcon} src = {HomerIcon}/>
    <p className={styles.MainTitle}>ILIAD</p> <p className={styles.TitleSuffix}>.PEDIA</p>
    </div>

    <div className={styles.BookContainer}>
         <Book props ={props}/>
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
      <input className={styles.TitleInput}></input> <br/>
      <input className={styles.BioInput}></input>
      <button className = {styles.ArticleSubmit}>Submit</button>
    </div>
     </>
  )


}




export default App
