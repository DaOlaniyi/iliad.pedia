import HTMLFlipBook from 'react-pageflip';
import styles from './Book.module.css';
import FullIliad from './assets/iliad.json';
import type { JSX } from 'react/jsx-runtime';
import * as Colors from './constants/Colors.tsx';
import * as Numbers from './constants/Numbers.tsx';
import * as Utilities from './constants/Utilities.tsx';
import * as Articles from './data/ArticleManager.tsx';
import { type SetPageFunc } from './App.tsx';
import React, { useCallback, useEffect, useState } from 'react';

export default function Book(props : any) {
    
   // const SetPage:SetPageFunc = props;
    useEffect(() =>{
        console.log("sending registration to app!");
        props.props.Register(UpdateBook);//Give app our update method
    }, [])

      const [PageElements, SetPageElements] = useState<JSX.Element[]>([<></>]);


    let FullText = FullIliad['Book 1'];
    let RawPageBlocks : string[] = [];

    RawPageBlocks = SplitIntoRawPageBlocks(FullText);
   
    const UpdateBook = useCallback((articles: Map<string,string>)=> {
        if(!articles) return;
        console.log("Book is being told to update by app!");
        const book = RawPageBlocks.map((page, index) => CreatePageElement(page, index, props.props.SetInfo, articles));
        SetPageElements(book);
    },[])
    
    return (
         
        <HTMLFlipBook 
        width={Numbers.BookWidth} 
        height={Numbers.BookHeight} 
        maxShadowOpacity={0.5} 
        drawShadow = {true} 
        showCover = {false}
        size = "fixed"
        >
            <div className={styles.page} >
                <img
              src="https://cloud.firebrandtech.com/api/v2/image/111/9780785845508/CoverArtHigh/XL"
              alt=""
              style={{ width: Numbers.BookWidth, height: Numbers.BookHeight }}
              className={styles.pokemonLogo}
            />
            </div>
            {PageElements}
           
           
         </HTMLFlipBook>
    );
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
    const WordList = page.split(" ");
    
    //Decide page color
    const pageColor = Colors.GetPageColor(index);
    
    //Create list of elements.  We will add onto this list to create our final output
    let PageElementList : JSX.Element[] = []; 

    //Cycle through word list and search for keywords
    for(let i = 0; i < WordList.length; i++){

        let WordStr = WordList[i];
        let WordJSX = <>  </>;
        let CleanTitle = "";


        CleanTitle = WordStr.replaceAll(",", "");
        CleanTitle = CleanTitle.replaceAll(".", "");
        CleanTitle = CleanTitle.replaceAll(":", "");

        
        const ArticleExists = ArticleMap.has(CleanTitle);

        if(!ArticleExists){
                        WordJSX = <> {WordStr + " "} </>;
        }
        else {
           const Article = ArticleMap.get(CleanTitle);
           if(Article){
                WordJSX = <><a onClick={() => SetInfoPanel(CleanTitle, Article)}> {WordStr} </a> </>;
           }
        }

        PageElementList = PageElementList.concat(WordJSX); // add each word as mini element
        
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
            
            {PageElementList}   
            {IndexJSX}
       
        </div>
    </div>
    </div>)  }

