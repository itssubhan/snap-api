const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req,res)=>{
  res.send("Advanced Video Downloader API Running");
});

app.get("/info", async (req,res)=>{
  const url = req.query.url;

  if(!url){
    return res.json({error:"URL required"});
  }

  try{

    const info = await ytdlp(url,{
      dumpSingleJson:true,
      noWarnings:true,
      preferFreeFormats:true
    });

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      uploader: info.uploader,
      platform: info.extractor,
      formats: info.formats
        .filter(f=>f.ext==="mp4")
        .map(f=>({
          quality:f.format_note || f.height+"p",
          url:f.url
        }))
    });

  }catch(e){

    res.json({
      error:"Video fetch failed",
      message:e.message
    });

  }

});

app.get("/download", async (req,res)=>{
  const url = req.query.url;

  if(!url){
    return res.json({error:"URL required"});
  }

  try{

    const info = await ytdlp(url,{
      dumpSingleJson:true,
      noWarnings:true
    });

    const format = info.formats.reverse().find(f=>f.ext==="mp4");

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      download: format ? format.url : null
    });

  }catch(e){

    res.json({
      error:"Download failed",
      message:e.message
    });

  }

});

app.listen(PORT,()=>{
  console.log("Server running on port "+PORT);
});
