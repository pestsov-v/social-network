$(document).ready(() => {
  $.get("/api/chats", (data, status, xhr) => {
    if (xhr.status == 400) {
      alert("Не выходит получить список чатов. Попробуйте позже.");
    } else {
      outputChatList(data, $(".resultsContainer"));
    }
  });
});

function outputChatList(chatList, container) {
  chatList.forEach((chat) => {
    const html = createChatHtml(chat);
    container.append(html);
  });

  if (chatList.length == 0) {
    container.append(
      "<span class='NoResults'>Вы не участвуете ни в одном чате</span>"
    );
  }
}
