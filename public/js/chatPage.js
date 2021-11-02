$("#chatNameButton").click(() => {
    const name = $("#chatNameTextbox").val().trim()
    
    $.ajax({
        url: "/api/chats/" + chatId,
        type: "PUT",
        data: {chatName: name},
        success: (data, status, xhr) => {
            if (xhr.status != 204) {
                alert("Не вышло обновить название чата")
            } else {
                location.reload()
            }
        }
    })
})

$(".sendMessageButton").click(() => {
    messageSubmitted()
})

$(".inputTextbox").keydown((event) => {

    if (event.which == 13) {
        messageSubmitted()
        return false
    }
    
})

function messageSubmitted() {
    const content = $(".inputTextbox").val().trim()

    if (content != "") {
        sendMessage(content)
        $(".inputTextbox").val("");
    }
}

function sendMessage(content) {
    $.post("/api/messages", { content: content, chatId: chatId }, (data, status, xhr) => {
        addChatMessageHtml(data)


    })
}

function addChatMessageHtml(message) {
    if (!message || !message._id) {
        alert("Недействительное сообщение");
        return
    } 

    const messageDiv = createMessageHtml(message);

    $(".chatMessages").append(messageDiv)
}

function createMessageHtml(message) {
    const isMine = message.sender._id == userLoggedIn._id;
    const liClassName = isMine ? "mine" : "theirs";
    

    return `<li class='message ${liClassName}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}