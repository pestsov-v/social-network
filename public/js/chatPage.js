let typing = false;
let lastTypingTime;

$(document).ready(() => {

    socket.emit("join room", chatId);
    socket.on("typing", () => $(".typingDots").show())
    socket.on("stop typing", () => $(".typingDots").hide())

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
        addMessagesHtmlToPage(messagesHtml);
        scrollToBottom(false);

        $(".loadingSpinnerContainer").remove()
        $(".chatContainer").css("visibility", "visible")
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

    updateTyping()

    if (event.which == 13) {
        messageSubmitted()
        return false
    }
})

function updateTyping() {
    if (!connected) return;

    if (!typing) {
        typing = true;
        socket.emit("typing", chatId);
    }

    lastTypingTime = new Date().getTime();
    const timerLength = 3000

    setTimeout(() => {
        const timeNow = new Date().getTime();
        const timeDiff = timeNow - lastTypingTime;

        if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", chatId);
            typing = false;
        }

    }, timerLength)
}

function addMessagesHtmlToPage(html) {
    $(".chatMessages").append(html);
}

function messageSubmitted() {
    const content = $(".inputTextbox").val().trim()

    if (content != "") {
        sendMessage(content)
        $(".inputTextbox").val("");
        socket.emit("stop typing", chatId);
        typing = false;
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

        if (connected) {
            socket.emit("new message", data);
        }
    })
}

function addChatMessageHtml(message) {
    if (!message || !message._id) {
        alert("Недействительное сообщение");
        return
    } 

    const messageDiv = createMessageHtml(message, null, "");

    addMessagesHtmlToPage(messageDiv);
    scrollToBottom(true);
}

function createMessageHtml(message, nextMessage, lastSenderId) {

    let nameElement = "";
    let imageContainer = "";
    let profileImage = "";

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

        if (!isMine) {
            nameElement = `<span class='senderName'>${senderName}</span>`
        }
    }

    if (isLast) {
        liClassName += " last"
        profileImage = `<img src='${sender.profilePic}'>`
    }

    if (!isMine) {
        imageContainer = `<div class='imageContainer'>
                            ${profileImage}
                        </div>`
    }
    
    return `<li class='message ${liClassName}'>
                ${imageContainer}
                <div class='messageContainer'>
                    ${nameElement}
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}

function scrollToBottom(animated) {
    const container = $(".chatMessages");
    const scrollHeight = container[0].scrollHeight;

    if (animated) {
        container.animate({ scrollTop: scrollHeight }, "slow");
    } else {
        container.scrollTop(scrollHeight);
    }
}