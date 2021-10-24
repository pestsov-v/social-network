$(document).ready(() => {
    loadPost()
})

function loadPost() {
        $.get("/api/posts", { postedBy: profileUserId }, results => {
            outputPosts(results, $(".postsContainer"))       
    })
}
