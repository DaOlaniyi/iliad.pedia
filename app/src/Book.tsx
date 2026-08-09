import HTMLFlipBook from 'react-pageflip';
import FlippingState from 'react-pageflip';
import styles from './Book.module.css';
import FullIliad from './assets/iliad.json';
import type { JSX } from 'react/jsx-runtime';
import * as Colors from './constants/Colors.tsx';
import * as Numbers from './constants/Numbers.tsx';
import * as Utilities from './constants/Utilities.tsx';
import { motion, number, scale } from "motion/react"

import * as Articles from './data/ArticleManager.tsx';
import { type SetPageFunc } from './App.tsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const BookState = {
  Initializing: "Initializing",
  Registering: "Reg",
  Idle: "Idle",
  LoadingNext:"Next"
} as const;

type BookState = typeof BookState[keyof typeof BookState];


export default function Book(props : any) {
    
    const [FullText, SetFullText] =useState<string>("");
    const [RawPageBlocks, SetRawPageBlocks] = useState<string[]>([]);

    const BookRef = useRef<any>(null);
    const [PageNumber, SetPageNumber] = useState<number>(); 
    const [BookNumber, SetBookNumber] = useState<number>(1); 
    const [CurrentState, SetState] = useState<BookState>(BookState.Initializing); 
    const [PageElements, SetPageElements] = useState<JSX.Element[]>([<></>]);
    const [ArticleMap, SetArticleMap] = useState<Map<string, string>>(new Map());
    const [UpdateIsQueued, QueueUpdate] = useState<boolean>(false);

    const LastPage = (n:number) => ( 
        <div className={styles.page} > 
            <div className={styles.bookNumber}>End of Book {n} <br/>
            {n < 24 ?    <button className = {styles.BannerButton} onClick={ () => {NextBook()}}>Read Book {n+1}</button> : <></>}
         
        </div> 
        </div>
);

   // const SetPage:SetPageFunc = props;
    useEffect(() =>{
        if(CurrentState ==  BookState.Initializing) {
        InitializeRawPageBlocks(1);
        }

     if(CurrentState == BookState.Registering){
        console.log("sending registration to app!");
        props.props.Register(UpdateBook);//Give app our update method
     }

       switch(CurrentState) {
        case BookState.Initializing:
            SetState(BookState.Registering);
            break;
        case BookState.Registering:
            SetState(BookState.Idle);
            break;
       }

    }, [RawPageBlocks]); 


    //Update book if we're in a loading state
    useEffect(() => {
        if(CurrentState == BookState.LoadingNext){
            SetState(BookState.Idle);
            UpdateBook(ArticleMap);
        }
    })



    const UpdateBook = useCallback((articles: Map<string,string>)=> {
        if(!articles) return;
        SetArticleMap(articles);
        console.log("Book is being told to update by app!");

        //Since we embed the Last Page here, the CurrentState must be idle. If its not, 
        //CurrentState will carry its non-idle state into the next UpdateBook calls such that 
        //whenever the NextPage button is clicked, the necessary methods will have an outdated version of 
        //current state.   
        // Queuing the update allows the proper state of idle to load, preventing issues
        if(CurrentState != BookState.Idle){
            console.log("Book state not ready, update queued!");
            QueueUpdate(true);
            return;
        }else{
           console.log("Book state is ready, update processing..!");
        }

        let book = RawPageBlocks.map((page, index) => CreatePageElement(page, index + 1, props.props.SetInfo, articles));
        book = book.concat(LastPage(BookNumber)); // This line is the source of much problems, and why the queuing system was initially needed
        console.log(`Embedding next page with state value of '${CurrentState}'`)
        SetPageElements(book);
    }, [RawPageBlocks, CurrentState])

    /*If we have an update Queued, and the current state is idle, then push the stored update and remove it from the queue*/
        if(UpdateIsQueued && CurrentState == BookState.Idle){
        console.log("check valid. update pushing!");
        UpdateBook(ArticleMap);
        QueueUpdate(false);
    }

    const NextBook = ()=> {
        // const pageIndex =  BookRef.current?.pageFlip().getCurrentPageIndex();
        // const pageCount = BookRef.current.pageFlip().getPageCount();
    console.log("Next Book Ordered, current state =" , CurrentState)

     if(CurrentState == BookState.Idle){
         console.log(`State Valid -> Loading Book ${BookNumber + 1}..`)
         InitializeRawPageBlocks(BookNumber + 1); 
         SetState(BookState.LoadingNext);
         SetFullText(FullIliad['Book 2']);
         BookRef.current?.pageFlip().turnToPage(0);
     }else{ 
         console.log(`State Invalid ->  load rejected`)
     }
    }

    useKey('ArrowRight', () => {
        console.log("book ref = " , BookRef);
        if(BookRef.current?.pageFlip().getState() == `flipping`) return;
        //  const pageIndex =  BookRef.current?.pageFlip().getCurrentPageIndex();
         const pageCount = BookRef.current?.pageFlip().getPageCount();
         BookRef.current?.pageFlip().turnToPage(pageCount-1);
  });
    
    return (

         <>   
         {/* @ts-expect-error - react-pageflip types are incomplete */}
         <HTMLFlipBook 
        width={Numbers.BookWidth} 
        height={Numbers.BookHeight} 
        maxShadowOpacity={0.5} 
        drawShadow = {true} 
        showCover = {false}
        size= "fixed"
        className={styles.BookParent}
        // onFlip={}
        ref = {BookRef}
        >
            <div className={styles.page} >
              <div className={styles.bookNumber}>Book {BookNumber}</div> 
            </div>

            {PageElements}
            {/* {PageElements.length > 0? LastPage : <></>} */}
 

         </HTMLFlipBook>
                 </>
     

    );

    function InitializeRawPageBlocks(bookNumber: number) {
        let a = 'Book ' + bookNumber;
        let StartingText = FullIliad[a];
        StartingText = StartingText?.replaceAll("\"", " \"");
        SetFullText(StartingText);
        SetBookNumber(bookNumber);
        SetRawPageBlocks(SplitIntoRawPageBlocks(StartingText));
    }
}



/** SUMMARY 📝 
 * @param {string} {TextSample} the raw and single-line text to split into 
 * @returns {string[]} A list of strings that each contain ~({@link Numbers.MaxPageChars}) amount of characters.
 *  
 ⚙️ General Summary {
    The primary loop adds pages to PageList UNTIL the end index reaches the length of the text.
    Each iteration of the loop seeks to handle an entire page. Not just one character.  
 
    ⭐️ Word Preservation System {
      If the ending character lands in the middle of a word: 
        ‣ Addition to the PageList and StartIndex increments will be skipped.
        ‣ The EndIndex will increase per iteration UNTIL the ending character is valid. 
        ‣ A counter will store each increment the start index missed and apply it later.
 }
        
 * ⚠️ NOTE: The character count per page will expand IF AND ONLY IF the final character on a page returns false when passed into {@link Utilities.IsStoppingCharacter}(). 
 * Explore local function comments for more information.
 */ 
function SplitIntoRawPageBlocks(TextSample: string) {
  
    let PageList : string[] = [];
    let MaxPageChars = Numbers.MaxPageChars // Maximum number of characters on page (approximate technically)

    /*The indices for the first and last character in each page.  The 'start' index begins at 0
    because we want to start at the beginning of the book*/
    let StartingCharIndex=0;
    let EndingCharIndex = MaxPageChars; 

    let delayedStartIncrement = 0; 

    // This loop adds pages to PageList UNTIL the end of the text is reached. 
    // ⚠️ REMEMBER: This loop cycles in large gaps, not in singular increments. 
    // Ending Indices will go from 500 to 1000 within two steps (if the ending char is a punctuation mark)
    while (EndingCharIndex < TextSample.length) {

        //Get the ending character and check if we are in the middle of a word or not
        const endingChar = TextSample.charAt(EndingCharIndex - 1);
        const stopReached = Utilities.IsStoppingCharacter(endingChar);

        //if we have not reached a stop, keep adding characters (avoids cutting words short between pages)
        if (!stopReached) {
            EndingCharIndex++;
            delayedStartIncrement++;
            continue;
        }

        //Substring an entire page of the sample into the page list
        PageList = PageList.concat(TextSample.substring(StartingCharIndex, EndingCharIndex));

        //If we are on the last section of sample text.
        if (EndingCharIndex + MaxPageChars > TextSample.length) {
            PageList = PageList.concat(TextSample.substring(EndingCharIndex, TextSample.length)); //Add remaining portion
            break; //quit the while loop
        }

        //Add the char limits to the start and end indices so that we will fetch the next page on the next cycle.  
        //Also, add the delayed start increment so that the next page doesn't capture the remnants of the previous page 
        StartingCharIndex += MaxPageChars + delayedStartIncrement; // increment is added here so that beginning of pages arent clipped
        EndingCharIndex += MaxPageChars;
        delayedStartIncrement = 0; //reset the delayed increment for the next cycle
    }

    return PageList;
}


function CreatePageElement(page:string,index: number, setPage:SetPageFunc, ArticleMap:Map<string,string>) { 

     // Split the entire page into individual words.
    // This is what we'll be processing.
    let WordList = page.split(/(\s+|["'.:;!?,\-])/);
    //Decide page color
    const pageColor = Colors.GetPageColor(index);
    
    //Create list of elements.  We will add onto this list to create our final output
    let WordElementList : JSX.Element[] = []; 

    //Cycle through word list and search for keywords
    for(let i = 0; i < WordList.length; i++){

        let WordStr = WordList[i];
        let WordJSX = <>  </>;
        let CleanTitle = "";


        CleanTitle = WordStr.replaceAll(",", "");
        CleanTitle = CleanTitle.replaceAll(".", "");
        CleanTitle = CleanTitle.replaceAll(":", "");
        CleanTitle = CleanTitle.replaceAll("\"", "");
        CleanTitle = CleanTitle.replaceAll("-", "");

        
        const ArticleExists = ArticleMap.has(CleanTitle);

        if(!ArticleExists){
            WordJSX = <>{WordStr}</>;
        }
        else {
           const Article = ArticleMap.get(CleanTitle);
           if(Article){
                WordJSX = <><a onClick={() => SetInfoPanel(CleanTitle, Article)}>{WordStr}</a></>;
           }
        }

        WordElementList = WordElementList.concat(WordJSX); // add each word as mini element
        
    }

    function SetInfoPanel(title:string, bio:string) {
      setPage(title, bio);
    }

const IndexJSX = <><br/>Page {index}</>; // create page counter

//Return the compiled list of elements, wrapped in the appropriate page div brackets
    return (  
    <div className={styles.page}>
    <div style ={{background:pageColor, height:"100%"}}>
        <div className ={styles.pageContent}>
            
            {WordElementList}   
       
        </div>
        <div className={styles.PageNumber}>{IndexJSX}</div>
                    

    </div>
    </div>)  
    }

function useKey(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback]);
}