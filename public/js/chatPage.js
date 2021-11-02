$(document).ready(() => {

    $.get(`/api/chats/${chatId}`, (data) => $("#chatName").text(getChatName(data)))

    $.get(`/api/chats/${chatId}/messages`, (data) => {
        let messages = [];
        let lastSenderId = "";


        data.forEach((message, index) => {
            const html = createMessageHtml(message, data[index + 1], lastSenderId);
            messages.push(html)

            lastSenderId = message.sender._id;

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

    const messageDiv = createMessageHtml(message, null, "");

    addMessagesHtmlToPage(messageDiv)
}

function createMessageHtml(message, nextMessage, lastSenderId) {

    const sender = message.sender;
    const senderName = sender.firstName + " " + sender.lastName;
    const currentSenderId = sender._id;
    const nextSenderId = nextMessage != null ? nextMessage.sender._id : "";
    const isFirst = lastSenderId != currentSenderId;
    const isLast = nextSenderId != currentSenderId;

    const isMine = message.sender._id == userLoggedIn._id;
    let liClassName = isMine ? "mine" : "theirs";

    if (isFirst) {
        liClassName += " first";
    }

    if (isLast) {
        liClassName += " last"
    }
    

    return `<li class='message ${liClassName}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}