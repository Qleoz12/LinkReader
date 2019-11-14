const Realm = require('realm');
export const Article_SCHEMA = "Article";

// Define your models and their properties
export const ArticleSchema = {
    name: Article_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',    // primary key
        desc: 'string',
        url: 'string',
        creationDate: 'date',
    }
};
const databaseOptions = {
    path: 'LinkReaderApp.realm',
    schema: [ArticleSchema],
    schemaVersion: 0, //optional    
};

//functions for TodoLists
export const insertNewArticle = newArticle => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {
        realm.write(() => {
            realm.create(Article_SCHEMA, newArticle);
            resolve(newArticle);
        });
    }).catch((error) => reject(error));
});

export const updateArticle = Article => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let updatingArticle = realm.objectForPrimaryKey(Article_SCHEMA, Article.id);   
            updatingArticle.desc = Article.name;
            updatingArticle.url = Article.url;    
            resolve();     
        });
    }).catch((error) => reject(error));
});
export const deleteArticle = ArticleId => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let deletingArticle = realm.objectForPrimaryKey(Article_SCHEMA, ArticleId);
            realm.delete(deletingArticle);
            resolve();   
        });
    }).catch((error) => reject(error));;
});
export const deleteAllArticles = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        realm.write(() => {
            let allArticles = realm.objects(Article_SCHEMA);
            realm.delete(allArticles);
            resolve();
        });
    }).catch((error) => reject(error));;
});

export const queryAllArticles = () => new Promise((resolve, reject) => {    
    Realm.open(databaseOptions).then(realm => {        
        let allArticles = realm.objects(Article_SCHEMA);
        resolve(allArticles);  
    }).catch((error) => {        
        reject(error);  
    });;
});
export const filterArticles = (searchedText) => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
        let filteredArticles = realm.objects(Article_SCHEMA)
                                .filtered(`desc CONTAINS[c] "${searchedText}"`);//[c] = case insensitive
        resolve(filteredArticles);
    }).catch((error) => {
        reject(error);
    });;
});

export default new Realm(databaseOptions);