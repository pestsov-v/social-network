$(document).ready(() => {

    if(selectedTab === "followers") {
        loadFollowers();
    }
    else {
        loadFollowing();
    }
});

function loadFollowers() {
    $.get(`/api/users/${profileUserId}/followers`, results => {
        outputUsers(results.followers, $(".resultsContainer"));
    })
}

function loadFollowing() {
    $.get(`/api/users/${profileUserId}/following`, results => {
        outputUsers(results.following, $(".resultsContainer"));
    })
}

function outputUsers(results, container) {
    container.html("");

    results.forEach(result => {
        const html = createUserHtml(result, true);
        container.append(html);
    });

    if(results.length == 0) {
        container.append("<span class='noResults'>Ещё нет ниодной записи</span>")
    }
}

function createUserHtml(userData, showFollowButton) {

    const name = userData.firstName + " " + userData.lastName;
    const isFollowing = (userLoggedIn.following && userLoggedIn.following.includes(userData._id))
    let followButton = ""

    const text = isFollowing ? "Подписан" : "Подписаться"
    const buttonClass = isFollowing ? "followButton following" : "followButton"


    if (showFollowButton && userLoggedIn._id != userData._id) {
        followButton = `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                    </div>`
    }

    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>
                    </div>
                </div>
                ${followButton}
            </div>`;
}