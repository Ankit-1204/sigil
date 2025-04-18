import { Base_Actuator } from "./base";
class WikipediaSearchActuator extends Base_Actuator {
    constructor() {
      super(
        "Search Wikipedia for information",
        {
          "query": "The search query string",
          "numResults": "Optional. Number of results to return (default: 5)",
          "language": "Optional. Wikipedia language code (en, fr, es, etc). Default: en"
        }
      );
      
      this.baseUrl = 'https://en.wikipedia.org/w/api.php';
    }
    
    async execute(params) {
      if (!params.query) {
        throw new Error('Search query is required');
      }
      
      const language = params.language || 'en';
      const searchUrl = `https://${language}.wikipedia.org/w/api.php`;
      
      try {
        // First, search for relevant articles
        const searchResponse = await axios.get(searchUrl, {
          params: {
            action: 'query',
            list: 'search',
            srsearch: params.query,
            format: 'json',
            srlimit: params.numResults || 5,
            origin: '*'
          }
        });
        
        const searchResults = searchResponse.data.query.search;
        
        // If no results, return empty array
        if (!searchResults || searchResults.length === 0) {
          return {
            query: params.query,
            results: []
          };
        }
        
        // For the top result, get more detailed information
        const topResult = searchResults[0];
        const detailResponse = await axios.get(searchUrl, {
          params: {
            action: 'query',
            prop: 'extracts|info',
            exintro: true,
            explaintext: true,
            inprop: 'url',
            pageids: topResult.pageid,
            format: 'json',
            origin: '*'
          }
        });
        
        const pageId = topResult.pageid;
        const detailedInfo = detailResponse.data.query.pages[pageId];
        
        // Return structured results
        return {
          query: params.query,
          results: searchResults.map(result => ({
            title: result.title,
            snippet: result.snippet.replace(/<\/?span[^>]*>/g, ''),
            pageid: result.pageid,
            url: `https://${language}.wikipedia.org/wiki/${encodeURIComponent(result.title.replace(/ /g, '_'))}`
          })),
          topResult: {
            title: detailedInfo.title,
            extract: detailedInfo.extract,
            url: detailedInfo.fullurl
          }
        };
      } catch (error) {
        console.error('Wikipedia API error:', error.response?.data || error.message);
        throw new Error(`Wikipedia search failed: ${error.message}`);
      }
    }
  }
  
export { WikipediaSearchActuator };