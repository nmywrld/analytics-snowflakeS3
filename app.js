import express from "express";
import { s3func } from "./awsS3.js";


const app = express();
const port = 3000
app.post('/home', (req, res) => {

  res.send('Hello World!')
})

app.get('/testS3', (req, res) => {

  res.send('S3 functions test')

  s3func.main()

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})