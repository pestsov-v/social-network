$("#postTextarea").keyup(event => {
    const textbox = $(event.target)
    const value = textbox.val().trim()
    
    const submitButton = $("#submitPostButton");

    if (submitButton.length == 0) {
        return alert ("no submit button found");
    };

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
})

$("#submitPostButton").click(() => {
    const button = $(event.target);
    const textbox = $("#postTextarea");

    const data = {
        content: textbox.val()
    }

    $.post("/api/posts", data, postData => {
        
        let html = createPostHTML(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);

    })
})

function createPostHTML(postData) {
    
    const postedBy = postData.postedBy;
    const displayName = postedBy.firstName + " " + postedBy.lastName;
    const timestamps = postData.createdAt;

    return `<div class='post'>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${timestamps}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            
                        </div>
                    </div>
                </div>
            </div>`;
}