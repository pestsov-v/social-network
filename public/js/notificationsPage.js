$(document).ready(() => {
    $.get("/api/notifications", (data) => {
        outputNotificationList(data, $(".resultsContainer"))
    })
})

function outputNotificationList(notifications, container) {
    notifications.forEach(notification => {
        const html = createNotificationHtml(notification)
        container.append(html)
    })

    if (notifications.length == 0) {
        container.append("<span class='NoResults'>У вас нет никаких уведомлений</span>")
    }
}

function createNotificationHtml(notification) {

    const userFrom = notification.userFrom;

    return `<a href='#' class='resultListItem notification'>
                <div class='resultsImageContainer'>
                    <img src='${userFrom.profilePic}'>
                </div>
                <div class='resultsDetailsContainer ellipsis'>
                    <span ckass='ellipsis'>This is the text</span>
                </div>
            <a/>`
}