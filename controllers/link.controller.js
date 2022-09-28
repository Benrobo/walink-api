const Link = require("../models/Links.model");
const User = require("../models/Users.model");
const sendResponse = require("../helpers/response")
const { validatePhonenumber } = require("../helpers/validate")
const { genId } = require("../helpers")

function isUndefined(param){
  return typeof param === "undefined"
}

function isEmpty(param){
  return param === ""
}

class LinkController {
  
  #genUniqueId(length=5){
    let id = "";
    let char = "abcdefghijklmnopqrstuvwxyz".split("")
    
    Array(length).fill(0).forEach((elm, i)=>{
      const rand = Math.floor(Math.random() * char.length)
      id += char[rand]
    })
    return id;
  }
  
  async userExists(id){
    const userExistsResult = await User?.find({ id });

    if (userExistsResult.length === 0)
      return false
    return true
  }
  
  async allLinkByUserId(res){
    try{
      const userId = res.user?.id;
      const allLink = await Link.find({userId})
      
      return sendResponse(res, 200, true, "Link fetched successfully", allLink)
    }
    catch(e){
      console.log(e)
      return sendResponse(res, 200, true, "something went wrong")
    }
  }
  
  async allLinkById(res, id){
    try{
      const allLink = await Link.findOne({id})
      
      return sendResponse(res, 200, true, "Link fetched successfully", allLink || {})
    }
    catch(e){
      console.log(e)
      return sendResponse(res, 200, true, "something went wrong")
    }
  }
  
  async add(res, payload){
    const {message, phonenumber} = payload;
    const userId = res.user?.id;
    
    // validate payload
    if(isUndefined(phonenumber) || isEmpty(phonenumber)){
      return sendResponse(res, 400, false, "phonenumber cant be empty")
    }
    if(isUndefined(message) || isEmpty(message)){
      return sendResponse(res, 400, false, "message cant be empty")
    }
    if(!validatePhonenumber(phonenumber)){
      return sendResponse(res, 400, false, "phonenumber is invalid")
    }
    
    // check if user exists
   const userExists = await this.userExists(userId)
   
   if(!userExists){
     return sendResponse(
                res,
                404,
                false,
                "Failed to create link. user doest exists"
            );
   }
    
    const linkPayload = {
      id: this.#genUniqueId(),
      userId, 
      phonenumber,
      active: true,
      createdAt: Date.now()
    }
    
    try{
      await Link.create(linkPayload)
      
      return sendResponse(res, 200, true, "Link created successfully", linkPayload)
    }
    catch(e){
      console.log(e)
      return sendResponse(res, 500, false, `Something went wrong`)
    }
    
  }
  
  async delete(res, id){
    const linkId = id;
    const userId = res.user?.id;
    
    if(isUndefined(linkId) || isEmpty(linkId)){
      return sendResponse(res, 400, false, "linkId is missing.")
    }
    
    // check if user exists
   const userExists = await this.userExists(userId)
   
   if(!userExists){
     return sendResponse(
                res,
                404,
                false,
                "Failed to create link. user doest exists"
            );
   }
   
   // check if user who created the link is also the same person deleting it
   const userExistsResult = await User?.findOne({ id: userId });
   
    //console.log(userExistsResult, userId)     
    if(userExistsResult.id !== userId ){
      return sendResponse(
                res,
                401,
                false,
                "failed to delete link: permission denied."
            );
    }
    
    try{
      const filter = {id: linkId}
      await Link.deleteOne(filter)
      
      return sendResponse(res, 200, true, "link deleted")
    }
    catch(e){
      console.log(e)
      return sendResponse(res, 500, false, `Something went wrong`)
    }
  }
 
  async updateLinkStatus(res, payload){
    
    const userId = res.user?.id
    const { linkId , status} = payload;
    
    if(isUndefined(linkId) || isEmpty(linkId)){
      return sendResponse(res, 400, false, "link id cant be empty")
    }
    
    if(isUndefined(status) || isEmpty(status)){
      return sendResponse(res, 400, false, "link status cant be empty")
    }
    
    const userExists = await this.userExists(userId)
   
   if(!userExists){
     return sendResponse(
                res,
                404,
                false,
                "Failed to create link. user doest exists"
            );
   }
   
   const userExistsResult = await User?.findOne({ id: userId });
   
    //console.log(userExistsResult, userId)     
    if(userExistsResult.id !== userId ){
      return sendResponse(
                res,
                401,
                false,
                "failed to update link: permission denied."
            );
    }
    
    // check if link exists 
    const linkExistsResult = await Link?.find({ id: linkId });
    
    if(linkExistsResult.length === 0 ){
      return sendResponse(
                res,
                404,
                false,
                "failed to update link: link not found."
            );
    }
    
    try{
      const filter = {id: linkId}
      const data = {active: status}
      await Link.updateOne(filter, data)
      
      return sendResponse(res, 200, true, "link updated")
    }
    catch(e){
      console.log(e)
      return sendResponse(res, 500, false, `Something went wrong`)
    }
    
  }
}

module.exports = LinkController