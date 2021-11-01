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
        console.log(data);
    })
}