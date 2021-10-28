let timer;

$("#searchBox").keydown((event) => {
    clearTimeout(timer);
    let textbox = $(event.target);
    let value = textbox.val();
    let searchType = textbox.data().search;

    timer = setTimeout(() => {
        value = textbox.val().trim();

        if (value == "") {
            $(".resultsContainer").html("");
        } else {
            search(value, searchType);
        }
    }, 1000)
})

function search(searchTerm, searchType) {
    var url = searchType == "users" ? "/api/users" : "/api/posts"

    $.get(url, { search: searchTerm }, (results) => {
        
        if (searchType == "users") {

        } else {
            outputPosts(results, $(".resultsContainer"))
        }

    })
}