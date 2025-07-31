const { response } = require("express");
var express = require("express");
var fileuploader = require("express-fileupload");
var cloudinary = require("cloudinary").v2;
var fs=require("fs");
var mysql2 = require("mysql2");

var app = express();

app.use(fileuploader());

app.listen(2003, function () {
  console.log("Server Started at Port no: 2003")
})

//gemini connect
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyA_-uFDn42GrvScf-qVPHz029-YAiFp4M4");  //api key
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });





app.use(express.static("public"));
app.get("/", function (req, resp) {
  console.log(__dirname);
  console.log(__filename);
  //let path = __dirname + "/public/index.html";
  //resp.sendFile(path);

})


app.use(express.urlencoded(true));
cloudinary.config({
  cloud_name: 'dwg81rebh',
  api_key: '565883963282589',
  api_secret: 'UVfP7rHEty1RmTMCLNW8-cY8VeM' // Click 'View API Keys' above to copy your API secret
});



//..............................AIven..................
let dbConfig = "mysql://avnadmin:AVNS_NIJ_zhF5mEvm3O6oXIt@mysql-30439eae-japsanjam-05a5.c.aivencloud.com:27992/tournament";
let mySqlVen = mysql2.createConnection(dbConfig);
mySqlVen.connect(function (errKuch) {
  if (errKuch == null)
    console.log("Aiven Connected SUCCESSFULLYYY!!!!!");
  else
    console.log(errKuch.message)
})


app.get("/get-one", function (req, resp)   //signup start
{
  let emailid = req.query.txtEmail;
  let password = req.query.txtPwd;
  let usertype = req.query.comboState;
console.log(usertype)
  mySqlVen.query("insert into users(emailid,password,usertype,status) values(?,?,?,1)", [emailid, password, usertype], function (err, allRecords) {
    if (err == null) {
      resp.json(allRecords);
    }
    else
      resp.send(err.message);
  })
})                                                     //signup end

app.get("/do-login", function (req, resp) {                     //signup start
  let email = req.query.txtEmail
  let password = req.query.txtPwd;
  console.log(email);
  console.log(password);

  let query = "SELECT * FROM users WHERE emailid = ? AND password = ?";

  mySqlVen.query(query, [email, password], function (err, allRecords) {

    
      if (allRecords.length == 0) 
      {
        resp.send("Invalid");

      }
        else if (allRecords[0].status==1)
        {
          resp.send(allRecords[0].usertype);
        }
        else
          resp.send("Blocked");

      
      
    })
   
 
});
//signup end
app.post("/get-org", async function (req, resp)                //saving org details 
{
  let picurl = "";
  if (req.files != null) {
    let fName = req.files.profilePic.name;
    let fullPath = __dirname + "/public/pics/" + fName;
    req.files.profilePic.mv(fullPath);


    await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
      picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
      console.log(picurl);
    });
  }
  else {
    picurl = "nopic.jpg";
  }
  let emailid = req.body.txtE;
  let orgname = req.body.txtOrg;
  let regno = req.body.txtReg;
  let address = req.body.txtAdr;
  let addr = req.body.txtAddr;
  let city = req.body.txtCity;
  let state = req.body.txtState;
  let sports = req.body.txtSpo;
  let website = req.body.txtWeb;
  let instalink = req.body.txtInst;
  let orghead = req.body.txtHead;
  let contact = req.body.txtCon;
  let otherinfo = req.body.txtothin;



  mySqlVen.query("insert into orgdetail values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [emailid, orgname, regno, address, addr, city, state, sports, website, instalink, orghead, contact, picurl, otherinfo], function (errKuch) {

    if (errKuch == null)
      resp.send("record saved");
    else
      resp.send(errKuch)
  })
})

app.post("/update-org", async function (req, resp)                    //updating ord details
{
  
  let picurl = "";
  if (req.files != null) {
    let fName = req.files.profilePic.name;
    let fullPath = __dirname + "/public/uploads/" + fName;
    req.files.profilePic.mv(fullPath);


    await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
      picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server
      console.log(picurl);
    });
  }
  else {
    picurl = req.body.hdn;
  }
  let emailid = req.body.txtE;
  let orgname = req.body.txtOrg;
  let regno = req.body.txtReg;
  let address = req.body.txtAdr;
  let addr = req.body.txtAddr;
  let city = req.body.txtCity;
  let state = req.body.txtState;
  let sports = req.body.txtSpo;
  let website = req.body.txtWeb;
  let instalink = req.body.txtInst;
  let orghead = req.body.txtHead;
  let contact = req.body.txtCon;
  let otherinfo = req.body.txtothin;



  mySqlVen.query("update orgdetail set orgname=?,regno=?,address=?,addr=?,city=?,state=?,sports=?,website=?,instalink=?,orghead=?,contact=?,otherinfo=? where emailid=?", [orgname, regno, address, addr, city, state, sports, website, instalink, orghead, contact, picurl, otherinfo, emailid], function (errKuch,result) {

      if(errKuch==null)
      resp.send("record saved");
      else
      resp.send(errKuch.message);
    
  })


  })
  

app.get("/org-details", function (req, resp) {                             //card to org details form 
  console.log(__dirname);
  let path = __dirname + "/public/org-details.html";
  resp.sendFile(path);
})

app.get("/publish-events", function (req, resp) {                             //card to post events form 
  console.log(__dirname);
  let path = __dirname + "/public/publish-events.html";
  resp.sendFile(path);
})

app.get("/tourn-manager", function (req, resp) {                             //card to tour manager form 
  console.log(__dirname);
  let path = __dirname + "/public/tourn-manager.html";
  resp.sendFile(path);
})

app.get("/profile-player", function (req, resp) {                             //card to profile player
  console.log(__dirname);
  let path = __dirname + "/public/profile-player.html";
  resp.sendFile(path);
})

app.get("/admin-users-console", function (req, resp) {                             //card to users admin
  console.log(__dirname);
  let path = __dirname + "/public/admin-users-console.html";
  resp.sendFile(path);
})


app.get("/find-tournament", function (req, resp) {                             
  console.log(__dirname);
  let path = __dirname + "/public/find-tournament.html";
  resp.sendFile(path);
})




app.get("/get-three", function (req, resp)    //search
{
  mySqlVen.query("select * from orgdetail where emailid=?", [req.query.txtEmail], function (err, allRecords) {
    if (err == null) {
      if (allRecords.length == 0)
        resp.send("No Record Found");
      else
        resp.json(allRecords);
    }
    else
      resp.send(err.message);
  })
})



app.get("/get-postevent", function (req, resp)   //publish event
{
  let email = req.query.txtE2;
  let eventname = req.query.txtEvent;
  let eventdate = req.query.txtDate;
  let eventtime = req.query.txtTime;
  let address = req.query.txtAdr;
  let city = req.query.txtCity;
  let sports = req.query.txtSports;
  let minAge = req.query.txtMinAge;
  let maxage = req.query.txtMaxAge;
  let lastdate = req.query.txtLastDate;
  let fees = req.query.txtFee;
  let prizemoney = req.query.txtPrize;
  let contactperson= req.query.txtConPer;

  mySqlVen.query("insert into tournament(email,eventname,eventdate,eventtime,address,city,sports,minage,maxage,lastdate,fees,prizemoney,contactperson) values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [email, eventname,eventdate,eventtime,address,city,sports,minAge,maxage,lastdate,fees, prizemoney,contactperson], function (err, allRecords) {
    if (err == null) {
      resp.json(allRecords);
    }
    else
      resp.send(err.message);
  })
})                     



app.get("/do-fetch-all-tournament",function(req,resp)
{
  let email=req.query.email;
    console.log(req.query.email);
    mySqlVen.query("select * from tournament where email=?",[email],function(err,allRecords)
    {
           if(err==null)
           
                resp.send(allRecords);
                else 
                resp.send(err.message);
    })
})


app.get("/delete-one",function(req,resp)  //for
{
    console.log(req.query)
    let rid=req.query.rid;

    mySqlVen.query("delete from tournament where rid=?",[rid],function(errKuch,result)

    {
        if(errKuch==null)
                {
                    if(result.affectedRows==1)
                        resp.send(rid+" Deleted Successfulllyyyy...");
                    else
                        resp.send("Invalid Email id");
                }
                else
                resp.send(errKuch);

    })
}) 

//to run gemini
async function RajeshBansalKaChirag(imgurl) {
  const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string.";

  const imageResp = await fetch(imgurl).then((response) => response.arrayBuffer());

  const result = await model.generateContent([
      {
          inlineData: {
              data: Buffer.from(imageResp).toString("base64"),
              mimeType: "image/jpeg",
          },
      },
      myprompt,
  ]);

  const rawText = result.response.text();
  console.log("🔍 Raw OCR Output:", rawText);

  const cleaned = rawText.replace(/```json|```/g, '').trim();
  console.log("📦 Cleaned OCR JSON String:", cleaned);

  let jsonData;
  try {
      jsonData = JSON.parse(cleaned);
      console.log("✅ Parsed JSON:", jsonData);
  } catch (parseErr) {
      console.error("❌ JSON parse error:", parseErr);
      throw new Error("Failed to parse OCR response");
  }

  return jsonData;
}

app.post("/get-profile", async function (req, resp) {
  let picurl1 = "nopic.jpg";
  let jsonData = { name: "N/A", gender: "N/A", dob: "N/A" };

  // Aadhaar Upload & OCR
  if (req.files?.adhaarPic) {
      let fName = req.files.adhaarPic.name;
      let fullPath = __dirname + "/public/uploads/" + fName;
      await req.files.adhaarPic.mv(fullPath);

      try {
          let result = await cloudinary.uploader.upload(fullPath);
          picurl1 = result.url;

          jsonData = await RajeshBansalKaChirag(picurl1);
          console.log("Extracted JSON from Aadhaar:", jsonData);
      } catch (err) {
          console.error("Error uploading Aadhaar or parsing:", err);
          return resp.status(500).send("Aadhaar upload or OCR failed.");
      }
  }

  // Profile Pic Upload
  let picurl = "nopic.jpg";
  if (req.files?.profilePic) {
      let fiName = req.files.profilePic.name;
      let fullPath1 = __dirname + "/public/uploads/" + fiName;
      await req.files.profilePic.mv(fullPath1);

      try {
          let result = await cloudinary.uploader.upload(fullPath1);
          picurl = result.url;
      } catch (err) {
          console.error("Error uploading profile pic:", err);
      }
  }

  // Fetch form values as per HTML
  let emailid = req.body.email;         
  let address = req.body.Adr;           
  let contactnumber = req.body.Con;     
  let games = req.body.games;           
  let info = req.body.othin;            

  console.log("Form data received:", req.body);

  // Save to database
  mySqlVen.query(
      "INSERT INTO players VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [emailid, picurl1, picurl, jsonData.name, jsonData.gender, jsonData.dob, address, contactnumber, games, info],
      function (errKuch) {
          if (errKuch == null) {
              resp.send("Record Saved Successfully... Badhai!");
          } else {
              console.error("MySQL Error:", errKuch);
              resp.status(500).send("Database error: " + errKuch.message);
          }
      }
  );
});




app.post("/update-profile", async function (req, resp)                    //updating ord details
{
  let adhaarpicurl = "";
  if (req.files != null) {
    let fName = req.files.adhaarPic.name;
    let fullPath = __dirname + "/public/pics/" + fName;
    req.files.adhaarPic.mv(fullPath);


    await cloudinary.uploader.upload(fullPath).then(function (adhaarpicUrlResult) {
      adhaarpicurl = adhaarpicUrlResult.url;   //will give u the url of ur pic on cloudinary server
      console.log(adhaarpicurl);
    });
  }
  else {
    adhaarpicurl = "nopic.jpg";
  }

  let profilepicurl = "";
  if (req.files != null) {
    let fName = req.files.profilePic.name;
    let fullPath = __dirname + "/public/pics/" + fName;
    req.files.profilePic.mv(fullPath);


    await cloudinary.uploader.upload(fullPath).then(function (profilepicUrlResult) {
      profilepicurl = profilepicUrlResult.url;   //will give u the url of ur pic on cloudinary server
      console.log(profilepicurl);
    });
  }
  else {
    profilepicurl = "nopic.jpg";
  }
  let emailid = req.body.email;
  let address = req.body.Adr;
  let contact = req.body.Con;
  let gamesuplay = req.body.games;

  let otherinfo = req.body.othin;

  mySqlVen.query("update players set address=?,contact=?,gamesuplay=?,otherinfo=? where emailid=?", [address, contact, gamesuplay, otherinfo, emailid], function (errKuch,result) {

      if(errKuch==null)
      resp.send("record saved");
      else
      resp.send(errKuch.message);
    
  })


  })


app.get("/get-profile", function (req, resp)    //get data
{
  mySqlVen.query("select * from players where emailid=?", [req.query.email], function (err, allRecords) {
    if (err == null) {
      if (allRecords.length == 0)
        resp.send("No Record Found");
      else
        resp.json(allRecords);
    }
    else
      resp.send(err.message);
  })
})



app.get("/do-fetch-users",function(req,resp)
{
        mySqlVen.query("select * from users",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})


// -------------------------- Block User ----------------------------
app.get("/do-block", function (req, resp) {
  let emailid = req.query.emailid;


  mySqlVen.query("UPDATE users SET status = 0 WHERE emailid = ?", [emailid], function (err, result) {
      if (err == null) {
          if (result.affectedRows == 1)
              resp.send("Blocked..");

          else
              resp.send("Invalid Email id");
      } else {
          resp.send(err.message);
      }
  });
});

// -------------------------- Resume User --------------------------
app.get("/do-UnBlock", function (req, resp) {
  let emailid = req.query.emailid;

  mySqlVen.query("UPDATE users SET status = 1 WHERE emailid = ?", [emailid], function (err, result) {
      if (err == null) {
          if (result.affectedRows == 1)
              resp.send("unBlocked..");
          else
              resp.send("Invalid Email id");
      } else {
          resp.send(err.message);
      }
  });
});



app.get("/do-fetch-tourn",function(req,resp)
{
        mySqlVen.query("select * from tournament",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})





app.get("/do-fetch-orgdetail",function(req,resp)
{
        mySqlVen.query("select * from orgdetail",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})

app.get("/do-fetch-players",function(req,resp)
{
        mySqlVen.query("select * from players",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})



app.get("/do-fetch-all-tour",function(req,resp)
{
  console.log(req.query)
        mySqlVen.query("select * from tournament where city=? and sports=?",[req.query.kuchCity,req.query.kuchSports],function(err,allRecords)
        {
          console.log(allRecords)
                    resp.send(allRecords);
        })
})


app.get("/do-fetch-all-cities",function(req,resp)
{
        mySqlVen.query("select distinct city from tournament",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})


app.get("/do-fetch-all-sports",function(req,resp)
{
        mySqlVen.query("select distinct sports from tournament",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})


app.get("/change-pwd", function (req, resp) {
  let email = req.query.kuchEmail;
  //alert("byee");

  mySqlVen.query("UPDATE users SET password=? WHERE emailid=? and password=?", [req.query.kuchNewPwd,email,req.query.kuchOldPwd], function (err, result)
   {
      if (err == null) 
      {
          if (result.affectedRows == 1)
              resp.send("password changed");
          else
              resp.send("Invalid Email id");
      }
       else 
      {
          resp.send(err.message);
      }
  });
});