'use strict';Object.defineProperty(exports,'__esModule',{value:!0});var _dotenv=require('dotenv'),_dotenv2=_interopRequireDefault(_dotenv),_express=require('express'),_express2=_interopRequireDefault(_express),_multer=require('multer'),_multer2=_interopRequireDefault(_multer),_bodyParser=require('body-parser'),_bodyParser2=_interopRequireDefault(_bodyParser),_invertedIndex=require('./inverted-index'),_invertedIndex2=_interopRequireDefault(_invertedIndex),_jsonProcessor=require('./json-processor'),_jsonProcessor2=_interopRequireDefault(_jsonProcessor);function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}_dotenv2.default.config();var NODE_ENV=process.env.NODE_ENV,app=(0,_express2.default)();if(NODE_ENV==='PROD'){app.set('PORT',process.env.PORT_PROD)}else if(NODE_ENV==='DEV'){app.set('PORT',process.env.PORT_DEV)}else{app.set('PORT',process.env.PORT_TEST)}app.use(_bodyParser2.default.json());app.use(_bodyParser2.default.urlencoded({extended:!1}));var uploadPath=process.cwd()+'/dist/uploads',storage=_multer2.default.diskStorage({destination:(a,b,c)=>{c(null,uploadPath)},filename:(a,b,c)=>{c(null,b.originalname)}}),upload=(0,_multer2.default)({storage:storage});app.use(upload.array('files',5));var invertedIndex=new _invertedIndex2.default,index=void 0;app.post('/api/create',(a,b)=>{try{var c=a.headers['content-type'].indexOf('application/json'),d=a.headers['content-type'].indexOf('multipart/form-data');if(c>-1){var e=a.body;index=_jsonProcessor2.default.processRaw(e,invertedIndex);return b.send(index)}else if(d>-1){var f=a.files;index=_jsonProcessor2.default.processFiles(f,invertedIndex);return b.send(index)}}catch(error){return b.send('invalid json file')}});app.post('/api/search',(a,b)=>{try{var c=a.body,d={};if(!index){return b.send('Please create an index. See documentation')}if(Array.isArray(c)){d=invertedIndex.searchIndex(index,void 0,c);return b.send(d)}var e=Object.keys(c);e.forEach(f=>{var g=c[f],h=invertedIndex.searchIndex(index,f,g);d[f]=h[f]});return b.send(d)}catch(error){return b.send('Invalid javascript object')}});var port=app.get('PORT');app.listen(process.env.PORT||port,()=>console.log('listening on port '+port));exports.default=app;