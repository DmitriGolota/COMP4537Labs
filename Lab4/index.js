const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 5000

const { Schema } = mongoose;

app.use(express.json())

const unicornSchema = new Schema({
  "name": String, // String is shorthand for {type: String}
  "weight": Number,
  "loves": [String],
  "gender": {
    enum: ["f", "m"]
  },
  "vampires": Number,
  "dob": Date
});

const unicornModel = mongoose.model('unicorns', unicornSchema); // unicorns is the name of the collection in db

app.listen(process.env.PORT || 5000, async function (err) {
  try {
    await mongoose.connect('mongodb+srv://root:G3YrA9HKolMud0m5@cluster0.fha6ifp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  } catch (error) {
    console.log('db error');
  }
  console.log(`Example app listening on port ${port}`)
})

// app.listen(port, async () => {
//   try {
//     await mongoose.connect('mongodb+srv://root:G3YrA9HKolMud0m5@cluster0.fha6ifp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
//   } catch (error) {
//     console.log('db error');
//   }
//   console.log(`Example app listening on port ${port}`)
// }
// )

app.get('/api/v2/unicorns', (req, res) => {
  unicornModel.find({})
    .then(docs => {
      console.log(docs)
      res.json(docs)
    })
    .catch(err => {
      console.error(err)
      res.json({ msg: "db reading .. err.  Check with server devs" })
    })
  // res.json(unicornsJSON)
})

app.post('/api/v2/unicorn', (req, res) => {
  // - create a new unicorn

  // unicornsJSON.push(req.body)
  //update the file
  // writeFileAsync('./data.js', JSON.stringify(unicornsJSON), 'utf-8')
  //   .then(() => { })
  //   .catch((err) => { console.log(err); })

  unicornModel.create(req.body, function (err) {
    if (err) console.log(err);
    // saved!
  });
  res.json(req.body)
})

app.get('/api/v2/unicorn/:id', (req, res) => {
  // var found = false
  // for (i = 0; i < unicornsJSON.length; i++) {
  //   if (unicornsJSON[i]._id == req.params.id) {
  //     found = true
  //     break
  //   }
  // }
  // if (found) { res.json(unicornsJSON[i]); return }
  // res.json({ msg: "not found" })

  // Find method bypass iterating through a DB -> much quick with mongodb
  console.log(req.params.id);
  unicornModel.find({ _id: `${req.params.id}` })
    .then(doc => {
      console.log(doc)
      res.json(doc)
    })
    .catch(err => {
      console.error(err)
      res.json({ msg: "db reading .. err.  Check with server devs" })
    })
})

app.patch('/api/v2/unicorn/:id', (req, res) => {
  // - update a unicorn

  // unicornsJSON = unicornsJSON.map(({ _id, ...aUnicorn }) => {
  //   // console.log(req.body);
  //   if (_id == req.body._id) {
  //     console.log("Bingo!");
  //     return req.body
  //   } else
  //     return aUnicorn
  // })
  // console.log(unicornsJSON);


  //update the file
  // writeFileAsync('./data.js', JSON.stringify(unicornsJSON), 'utf-8')
  //   .then(() => { })
  //   .catch((err) => { console.log(err); })
  // console.log(req.body);
  const { _id, ...rest } = req.body;
  unicornModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: { ...rest } }, { runValidators: true }, function (err, res) {
    // Updated at most one doc, `res.nModified` contains the number
    // of docs that MongoDB updated
    if (err) console.log(err)
    console.log(res)
  });

  res.send("Updated successfully")
})

app.delete('/api/v2/unicorn/:id', (req, res) => {
  // - delete a unicorn
  // unicornsJSON = unicornsJSON.filter((element) => element._id != req.params.id)

  // //update the file
  // writeFileAsync('./data.js', JSON.stringify(unicornsJSON), 'utf-8')
  //   .then(() => { })
  //   .catch((err) => { console.log(err); })
  unicornModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, result) {
    if (err) console.log(err);
    console.log(result);
  });
  
  res.send("Deleted successfully?")
})


