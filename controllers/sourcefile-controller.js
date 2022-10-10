const SourceFile = require("../models/SourceFile");
var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
const dontenv = require("dotenv");
const PythonShell = require('python-shell').PythonShell;


//add a Source controller
const addSourceFile = async (req, res, next) => {
    const {location } = req.body;

    let sourcefile;
    let uploadFile;
    let uploadPath;

// check uploaded file
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No file were uploaded.');
    }

    else{
      uploadFile = req.files.uploadFile;
      rootpath =require('path');
      root=rootpath.join(__dirname,'../');
      var fname=Date.now()+ uploadFile.name;
      uploadcarePath = 'resources/upload/' +fname;
      uploadPath = root+uploadcarePath;
      var link;
      uploadFile.mv(uploadPath, function(err) {
        if (err)
          return res.status(500).send(err);
        
        else{        
          var data = new FormData();
          data.append('UPLOADCARE_PUB_KEY', process.env.UPLOADCARE_PUB_KEY);
          data.append('files', fs.createReadStream(uploadcarePath));

          var config = {
            method: 'post',
            url: 'https://upload.uploadcare.com/base/',
            headers: { 
              ...data.getHeaders()
            },
            data : data
          };

          axios(config)
          .then(function (response) {
            link='https://ucarecdn.com/'+response.data["files"]+'/'+fname;
            try {
              sourcefile = new SourceFile({
                name: uploadFile.name+'',
                source_link: link+'',
                category: uploadFile.mimetype+'',
                location,
              });
              sourcefile.save();
              var options = {
                // mode: 'text',
                // pythonPath: 'python/',
                // pythonOptions: ['-u'],
                scriptPath: root+'python/',
                args: [link]
              };

              // PythonShell.run('model.py', options, function (err, results) {
              //   if (err) 
              //     throw err;
              //   // Results is an array consisting of messages collected during execution
              //   console.log('results:', results.toString());
              //   // res.send(results.toString());
              // });


            } catch (err) {
              console.log(err);
            }
            if (!sourcefile) {
              return res.status(404).json({ message: "file not uploaded" });
            }
            res.status(201).json({ sourcefile });

            // console.log(link);
          })
          .catch(function (error) {
            console.log(error);
          });
        }
      });
    }
    
  };

  //get all sourcefiles
const getAllSource = async (req, res, next) => {
  let sourcefiles;
  try {
    sourcefiles = await SourceFile.find();
  } catch (err) {
    console.log(err);
  }
  if (!sourcefiles) {
    return res.status(404).json({ message: "No sourcefiles found" });
  }
  res.status(200).json({ sourcefiles });
};

  module.exports = {
    addSourceFile: addSourceFile,
    getAllSource:getAllSource
  };