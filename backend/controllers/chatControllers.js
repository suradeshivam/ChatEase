const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = asyncHandler(async(req, res)=>{
    const {userId} = req.body

    if(!userId){
        console.log("userId param not send with req");
        res.sendStatus(400)
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            {users : { $elemMatch: {$eq: req.user._id}}},
            {users : {$elemMatch : {$eq: userId}}}
        ],
    })
    .populate("users","-password")
    .populate("latestMessage")

    isChat = await User.populate(isChat, {
        path:"latestMessage.sender",
        select:"name pic email",
    })

    if(isChat.length > 0){
        res.send(isChat[0])
    }
    else{
        var chatData = {
            chatName : "sender",
            isGroupChat : false,
            users: [req.user._id, userId],
        }


        try{
            const createChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({_id: createChat._id}).populate("users","-password")

            res.status(201).send(fullChat)
        }
        catch(err){
            throw new Error(err.message)
        }
    }
})

const fetchChats = asyncHandler( async(req, res)=>{
    try{
        Chat.find({users : {$elemMatch:{$eq: req.user._id}}})
        .populate("users", "-paasword")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAT:-1})
        .then(async(results) =>{
            results = await User.populate(results, {
                path:"latestMessage.sender",
                select:"name pic email",
            })

            res.status(200).send(results)
        })
    }catch(err){
        throw new Error(err.message)
    }
})

const createGroupChat = asyncHandler(async(req, res)=>{
    if(!req.body.users || !req.body.name){
        return res.sendStatus(400).send({message: "please fill all fields"})
    }

    var users = JSON.parse(req.body.users)

    if(users.length < 2){
        return res.status(400).send('more than 2 users are required to create a groupchat')
    }


    users.push(req.user)

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user,
        })

        const fullGroupChat = await Chat.findOne({
            _id: groupChat._id
        })
        .populate("users","-password")
        .populate("groupAdmin","-password")

        res.status(200).json(fullGroupChat)
    }
    catch(err){
        throw new Error(err.message)
    }
})

const renameGroupChat = asyncHandler(async(req, res)=>{
    const {chatId, chatName} = req.body

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true,
        }
    ).populate("users","-password")
    .populate("groupAdmin","-password")


    if(!updatedChat){
        throw new Error("Chat not found")
    }
    else{
        res.json(updatedChat)
    }
})

const addToGroup = asyncHandler( async(req, res)=>{
    const {chatId, userId} = req.body

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users:userId},
        },
        {
            new:true,
        }
    ).populate("users","-password")
    .populate("groupAdmin","-password")

    if(!added){
        throw new Error("Chat NOt Found")
    }else{
        res.json(added)
    }
})

const removeFromGroup = asyncHandler (async (req, res)=>{
    const {chatId, userId} = req.body
    
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull : {users: userId},
        },
        {
            new:true,
        }
    ).populate("users","-password")
    .populate("groupAdmin","-password")

    if(!removed){
        throw new Error("Chat Not Found")
    }else{
        res.json(removed)
    }


})

module.exports = {accessChat, fetchChats,createGroupChat, renameGroupChat, addToGroup, removeFromGroup}



