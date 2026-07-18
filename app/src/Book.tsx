import HTMLFlipBook from 'react-pageflip';
import styles from './Book.module.css';
import IliadText from './assets/iliad.json';

function MyBook() {

    const BookWidth = 536/2;
    const BookHeight = 702/2;

    let FullText = IliadText.BOOK1;
    let PageList : String[] = [];

    let pageCharLimit = 500;
    let start = 0;
    let end = pageCharLimit;
    let startIncrement = 0;

    while(end < FullText.length){

    const lastChar = FullText.charAt(end - 1); 
    const stopReached = lastChar === " " || lastChar === "." || lastChar === "," || lastChar === ":" || lastChar === ";";
    
    //if we have not reached a stop, keep adding characters (avoids cutting words short between pages)
    if(!stopReached){ 
        end++;
        startIncrement ++;
        console.log("I++ ->" + startIncrement);
        continue;
    }

    PageList = PageList.concat(FullText.substring(start,end ));

    //If we are on the last section
      if(end + pageCharLimit > FullText.length){
        PageList = PageList.concat(FullText.substring(end,FullText.length )); //Add remaining portion
        break; //quit the while loop
    }

    start+=pageCharLimit + startIncrement;
    end+=pageCharLimit;
    startIncrement = 0;
    }

    const PageData = [
     {
        id: "001",
        name: "Page 1",
        content: <p>Sing, O goddess, the anger of <a href=''>Achilles</a> son of Peleus, that brought countless ills upon the Achaeans. Many a brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures, for so were the counsels of Jove fulfilled from the day on which the son of Atreus, king of men, and great Achilles, first fell out with one another.</p>
       }, 
       {
        id: "001",
        name: "Page 1",
        content: <p>{IliadText.BOOK1}</p>,
       },{
        id: "001",
        name: "Page 1",
        content: <p>Sing, O goddess, the anger of <a href=''>Achilles</a> son of Peleus, that brought countless ills upon the Achaeans. Many a brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures, for so were the counsels of Jove fulfilled from the day on which the son of Atreus, king of men, and great Achilles, first fell out with one another.</p>
       },   {
        id: "001",
        name: "Page 1",
        content: <p>Sing, O goddess, the anger of <a href=''>Achilles</a> son of Peleus, that brought countless ills upon the Achaeans. Many a brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures, for so were the counsels of Jove fulfilled from the day on which the son of Atreus, king of men, and great Achilles, first fell out with one another.</p>
       }, 
    ];

    const PageLCol = "#ffd3aa";
    const PageRCol = "#ffeaaa";

    const Pages = PageList.map((page, index) => { 

    const pageCol = (index % 2 == 0) ? PageLCol : PageRCol;

    return    (  <div className={styles.page}>
        <div style ={{background:pageCol, height:"100%"}}>
        <div className ={styles.pageContent}>
            
            {/* <img 
                    src ="https://www.bard.org/news/the-iliad-fact-or-splendid-fiction/images/1531340630064-JJ1QTT7ZVZJYPVVSBV70-Homer.jpg"
                    alt ="missing pictre"
                    style={{ width: 40, height: 40 }}/>       */}
            {page}   
        <br/>
        Page {index}
        </div>
        </div>

        </div>)  })

    return (
         
        <HTMLFlipBook 
        width={BookWidth} 
        height={BookHeight} 
        maxShadowOpacity={0.5} 
        drawShadow = {true} 
        showCover = {true}
        size = "fixed"
        >
            <div className={styles.page} >
                <img
              src="https://cloud.firebrandtech.com/api/v2/image/111/9780785845508/CoverArtHigh/XL"
              alt=""
              style={{ width: BookWidth, height: BookHeight }}
              className={styles.pokemonLogo}
            />
            </div>
            {Pages}
           
           
         </HTMLFlipBook>
    );
}

export default MyBook;