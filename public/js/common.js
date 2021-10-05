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
        
        const html = createPostHTML(postData)
        $(".postsContainer").prepent(html);
        textbox.val("");
        button.pop("disabled", true)

    })
})

function createPostHTML(postData) {
    return postData.content
}