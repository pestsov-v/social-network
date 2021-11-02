$(document).ready(() => {

    $.get(`/api/chats/${chatId}/messages`, (data) => {
        const messages = [];

        data.forEach(message => {
            const html = createMessageHtml(message);
            messages.push(html)
        })

        const messagesHtml = messages.join("");
        addMessagesHtmlToPage(messagesHtml)
    })
})

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

function addMessagesHtmlToPage(html) {
    $(".chatMessages").append(html);
}

function messageSubmitted() {
    const content = $(".inputTextbox").val().trim()

    if (content != "") {
        sendMessage(content)
        $(".inputTextbox").val("");
    }
}

function sendMessage(content) {
    $.post("/api/messages", { content: content, chatId: chatId }, (data, status, xhr) => {

        if (xhr.status != 201) {
            alert("Не получилось отправить сообщение");
            $(".inputTextbox").val(content);
            return;
        } 
        addChatMessageHtml(data)
    })
}

function addChatMessageHtml(message) {
    if (!message || !message._id) {
        alert("Недействительное сообщение");
        return
    } 

    const messageDiv = createMessageHtml(message);

    addMessagesHtmlToPage(messageDiv)
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