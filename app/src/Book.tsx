import HTMLFlipBook from 'react-pageflip';
import styles from './Book.module.css';

function MyBook() {

    const BookWidth = 536/2;
    const BookHeight = 702/2;

    const PageData = [
     {
        id: "001",
        name: "Page 1",
        content: <p>Sing, O goddess, the anger of <a href=''>Achilles</a> son of Peleus, that brought countless ills upon the Achaeans. Many a brave soul did it send hurrying down to Hades, and many a hero did it yield a prey to dogs and vultures, for so were the counsels of Jove fulfilled from the day on which the son of Atreus, king of men, and great Achilles, first fell out with one another.</p>
       }, 
      {
        id: "002",
        name: "Page 2",
        content: <p>And which of the gods was it that set them on to quarrel? It was the son of Jove and Leto; for he was angry with the king and sent a pestilence upon the host to plague the people, because the son of Atreus had dishonoured Chryses his priest. Now Chryses had come to the ships of the Achaeans to free his daughter, and had brought with him a great ransom: moreover </p>
       }
    ];
    
    const Pages = PageData.map((page) => (
              <div className={styles.page} key={page.id}>
                    <img 
                    src ="https://www.bard.org/news/the-iliad-fact-or-splendid-fiction/images/1531340630064-JJ1QTT7ZVZJYPVVSBV70-Homer.jpg"
                    alt ="missing picture"
                    style={{ width: 40, height: 40 }}
                    />
                    {page.content}
              </div>
    ))
    return (

        <HTMLFlipBook 
        width={BookWidth} 
        height={BookHeight} 
        maxShadowOpacity={0.5} 
        drawShadow = {true} 
        showCover = {true}
        size = "fixed">

            <div className={styles.page} >
            <img
              src="https://cloud.firebrandtech.com/api/v2/image/111/9780785845508/CoverArtHigh/XL"
              alt=""
              style={{ width: BookWidth, height: BookHeight }}
              className={styles.pokemonLogo} />     
              
            </div>
        {Pages}
        </HTMLFlipBook>
    );
}

export default MyBook;