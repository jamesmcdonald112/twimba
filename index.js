import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if (e.target.dataset.response) {
        handleResponseClick(e.target.dataset.response)
    }
    else if(e.target.dataset.responseButton) {
        handleResponseSubmit(e.target.dataset.responseButton)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleResponseClick(tweetId) {
    const responseInputBox = document.getElementById(`response-container-${tweetId}`)

    if(responseInputBox) {
        responseInputBox.remove()
        return
    }
    

    const responseHtml = `
        <div id="response-container-${tweetId}" class="response-container">
            <textarea id="response-text-${tweetId}" placeholder="Write your reply..."></textarea>
            <button data-response-button="${tweetId}">Reply</button>
        </div>
    `

    document.getElementById(`replies-${tweetId}`).insertAdjacentHTML('beforebegin', responseHtml)
}

function handleResponseSubmit(tweetId) {
    const responseText = document.getElementById(`response-text-${tweetId}`).value.trim()

    if(!responseText) {
        return 
    }
    
    const reply = {
        handle: '@Scrimba',
        profilePic: `images/scrimbalogo.png`,
        tweetText: responseText
    }
    
    const targetTweet = tweetsData.find(tweet => tweet.uuid === tweetId)

    targetTweet.replies.push(reply)

    render()
    document.getElementById(`response-container-${tweetId}`)?.remove()
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let responseIconClass = tweet.replies.length > 0 ? 'has-replies' : ''
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-reply ${responseIconClass}"
                    data-response="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

