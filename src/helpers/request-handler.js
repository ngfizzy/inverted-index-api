import JSONProcessor from './json-processor';
import InvertedIndex from '../inverted-index';
import deleter from './uploads-deleter';

const invertedIndex = new InvertedIndex();
let index; // the index created when create index is called

/**
 * @description - Controllers class handles request. It has
 * Two static function that handles http request from
 * Both /api/create route and /api/search route
 */
class RequestHandler {
  /**
   * @description takes away all logic from  /api/create route
   * @static
   * @param {Request} req -Http request from requst from express
   * @param {Response} res -Http response from express
   * @returns {Response} - Http response. should send index created or error
   * message
   */
  static handleCreate(req, res) {
    try {
      const isReqJSON = req.headers['content-type'].indexOf('application/json');
      const isReqMultipart = req.headers['content-type'].indexOf('multipart/form-data');
      if (isReqJSON > -1) {
        const body = req.body;
        // goto json-processor.js file to see how this class works
        index = JSONProcessor.processRaw(body, invertedIndex);
        deleter.deleteAllUploads();
        return res.send(index);
      } else if (isReqMultipart > -1) {
        const files = req.files;
        // goto json-processor.js file to see how this class works
        index = JSONProcessor.processFiles(files, invertedIndex);
        deleter.deleteAllUploads();
        return res.send(index);
      }
    } catch (error) {
      return res.send('invalid json file');
    }
  }
  /**
   * @description -Removes all logic from /api/search route
   * @static
   * @param {Request} req -Http request from requst from express
   * @param {Response} res -Http response from express
   * @returns {Response} - Http response. should send search result created or error
   * message
   */
  static handleSearch(req, res) {
    try {
      const body = req.body;
      let searchResult = {};
      if (!index) {
        // if index is not yet created, send error message
        return res.send('Please create an index. See documentation');
      }
      // the request body is an array
      if (Array.isArray(body)) {
        searchResult = invertedIndex.searchIndex(index, undefined, body);
        return res.send(searchResult);
      }
      // if this line is reached, it means a javascript object is sent
      const fileNames = Object.keys(body);
      fileNames.forEach((fileName) => {
        const searchTerms = body[fileName]; // searchTerm for one file
        const result = invertedIndex.searchIndex(index, fileName, searchTerms);
        searchResult[fileName] = result[fileName];
      });
      return res.send(searchResult);
    } catch (error) {
      return res.send('Invalid javascript object');
    }
  }
}
export default { index, RequestHandler };
