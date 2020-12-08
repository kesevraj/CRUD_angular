const express = require("express");
const app = express();
const cors = require("cors");
const bodyp = require("body-parser");
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const url = "mongodb://localhost:27017";
const port = 3000;

app.use(cors());
app.use(bodyp.json());

//getting data from form & post to data base
app.post("/data/:email", function(req, res) {
  email = req.params.email;
   console.log(email);
  mongoclient.connect(url, function(err, client) {
    if (err) throw err;
    db = client.db("myemployee");

    // db.collection("employee").insertOne(req.body,(err,data)=>{
    //   if (err) throw err;

    //   // console.log(data)

    //   res.json({"mess":"inserted data in data base"})

    // })

    db.collection("employee").findOne({ email: email }, function(err, result) {
      if (err) throw err;
      // console.log(result);

      if (result) {
        res.json({ mess: "mail ID already registered" });
        client.close();
      } 
      else {
        db.collection("employee").insertOne(req.body, (err, data) => {
          if (err) throw err;

          res.json({ mess: "inserted data in data base" });

          client.close();
        });
      }
    });

    // client.close()
  });
});

//setting data to table from data base
app.get("/details", function(req, res) {
  mongoclient.connect(url, function(err, client) {
    if (err) throw err;

    // console.log(req.body)

    db = client.db("myemployee");

    db.collection("employee")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;
        // console.log(result);
        res.json(result);
      });
    client.close();
  });
});

//set data to form from data base
app.put("/setval/:id", function(req, res) {
  mongoclient.connect(url, function(err, client) {
    if (err) throw err;

    id = req.params.id;

    // console.log(id)

    db = client.db("myemployee");

    db.collection("employee").findOne(
      { _id: new mongodb.ObjectId(id) },
      function(err, result) {
        if (err) throw err;
        // console.log(result);
        res.json(result);
      }
    );

    client.close();
  });
});

//update data from data base
app.put("/update/:id", function(req, res) {
  mongoclient.connect(url, function(err, client) {
    if (err) throw err;

    email = req.params.id;

    // console.log(email)

    db = client.db("myemployee");

    db.collection("employee").updateOne({ email: email },{ $set: req.body}, function(err, obj) {
      if (err) throw err;
      console.log(`matched count ${obj.matchedCount} ,modified count ${obj.modifiedCount}`)
      if(obj.matchedCount==0)  res.json({ mess: "no employee matched" });
      else  res.json({ mess: "updated sucessfully" });
    })

    client.close()

  });
});

//delete data from data base
app.delete("/data/:id", function(req, res) {
  mongoclient.connect(url, function(err, client) {
    if (err) throw err;

    id = req.params.id;

    console.log(id);

    db = client.db("myemployee");

    db.collection("employee").deleteOne(
      { _id: new mongodb.ObjectId(id) },
      function(err, obj) {
        // {_id: "ObjectId("+'"'+id+'"'+")"},{ _id: ` ObjectId("${id}") `}
        if (err) throw err;
        console.log(obj.deletedCount + " document deleted");
        // console.log({_id: id })
        // console.log({ _id: new mongodb.ObjectId(id)})
      }
    );
    client.close();
  });
});

//message on empty url
app.get("/", function(req, res) {
  res.send("<h1>hellow switch to data</h1>");
});

//port listering
app.listen(port, () => {
  console.log(`Example app listening on the port ${port}!`);
});
