const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.get("/", (req,res) => res.send("SnapTube jesi API Running"));

app.get("/info", async (req,res) => {
  const url = decodeURIComponent(req.query.url || "");
  if(!url) return res.json({error:"URL required"});
  
  try{
    const info = await ytdlp(url, {dumpSingleJson:true, noWarnings:true});
    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      formats: info.formats
    });
  }catch(err){
    res.json({error:"Video fetch failed", details: err.message});
  }
});

app.get("/download", async (req,res) => {
  const url = decodeURIComponent(req.query.url || "");
  if(!url) return res.json({error:"URL required"});
  
  try{
    const info = await ytdlp(url, {dumpSingleJson:true, noWarnings:true});
    const best = info.formats.reverse().find(f=>f.url);
    res.json({
      title: info.title,
      download: best ? best.url : null
    });
  }catch(err){
    res.json({error:"Download failed", details: err.message});
  }
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));