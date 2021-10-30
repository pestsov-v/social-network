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
    const chatName = "Чат";
    const image = "";
    const latestMessage = "Это последнее сообщение из чата";

    return `<a href='/messages/${chatData._id}' class='resultListItem'>
                <div class="resultsDetailsContainer">
                    <span class="heading">${chatName}</span>
                    <span class="subText">${latestMessage}</span>
                </div>
            </a>`
}