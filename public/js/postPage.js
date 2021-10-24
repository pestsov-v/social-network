$(document).ready(() => {
    $.get("/api/posts/" + postId, results => {
        outputPosts(results, $(".postsContainer"))       
    })
})

