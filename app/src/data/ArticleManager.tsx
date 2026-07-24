type Article = {
    title : string,
    biography : string
}

const AchillesArticle : Article = {title : "Achilles", biography: "Dude was a GREAT warrior"} 
const AtreusArticle : Article = {title : "Atreus", biography: "Dude was a GREAT dad"} 

const ArticleMap = new Map<string, Article> (
   [["Achilles" , AchillesArticle],
    ["Atreus" , AtreusArticle], ]);

export function ArticleExists(name : string){
    return ArticleMap.has(name);
}
export function GetArticle(name : string) : string{
    const article = ArticleMap.get(name);

    if(article==undefined) return "ERROR";
    else return article.biography;
}