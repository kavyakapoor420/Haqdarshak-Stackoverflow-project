
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const schemeNameData=require('./SchemeNameData/schemNameData.json')

const app=express() 

//middlewares
app.use(cors())
app.use(express.json())


app.listen(3000,()=>{
    console.log("server is lisetning on port 3000")
})