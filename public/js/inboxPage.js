$(document).ready(() => {
    $.get("/api/chats", (data, status, xhr) => {
        if (xhr.status == 400) {
            alert("Не выходит получить список чатов. Попробуйте позже.")
        }  else {
            outputChatList(data, $(".resultsContainer"))
        }
    })
})

function outputChatList(chatList, container) {
    chatList.forEach(chat => {
        const html = createChatHtml(chat)
        container.append(html)
    })

    if (chatList.length == 0) {
        container.append("<span class='NoResults'>Вы не участвуете ни в одном чате</span>")
    }
}

function createChatHtml(chatData) {
    const chatName = getChatName(chatData);
    const image = getChatImageElements(chatData);
    const latestMessage = "Это последнее сообщение из чата";

    return `<a href='/messages/${chatData._id}' class='resultListItem'>
                ${image}
                <div class="resultsDetailsContainer ellipsis">
                    <span class="heading ellipsis">${chatName}</span>
                    <span class="subText ellipsis">${latestMessage}</span>
                </div>
            </a>`
}

function getChatName(chatData) {
    let chatName = chatData.chatName;

    if (!chatName) {
        const otherChatUsers = getOtherChatUsers(chatData.users);
        const namesArray = otherChatUsers.map(user => user.firstName + " " + user.lastName);
        chatName = namesArray.join(", ")
    }

    return chatName
}

function getOtherChatUsers(users) {
    if (users.length == 1) return users;
    
    return users.filter(user => user._id != userLoggedIn._id)
}

function getChatImageElements(chatData) {
    const otherChatUsers = getOtherChatUsers(chatData.users);

    let groupChatClass = "";
    let chatImage = getUserChatElement(otherChatUsers[0]);

    if (otherChatUsers.length > 1) {
        groupChatClass = "groupChatImage";
        chatImage += getUserChatElement(otherChatUsers[1]);
    }

    return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`
}

function getUserChatElement(user) {
    if (!user || !user.profilePic) {
        return alert("Ошибочная информация от пользователя")
    } 

    return `<img src='${user.profilePic}' alt="User's profile pic">`;
}