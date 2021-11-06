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
    const text = getNotificationText(notification)

    return `<a href='#' class='resultListItem notification'>
                <div class='resultsImageContainer'>
                    <img src='${userFrom.profilePic}'>
                </div>
                <div class='resultsDetailsContainer ellipsis'>
                    <span ckass='ellipsis'>${text}</span>
                </div>
            <a/>`
}

function getNotificationText(notification) {

    const userFrom = notification.userFrom
    if (!userFrom.firstName || !userFrom.lastName) {
        return alert("Пользователь не был запопулейтен")
    }

    const userFromName = `${userFrom.firstName} ${userFrom.lastName}`;
    let text

    if (notification.notificationType == "retweet") {
        text = `${userFromName} ретвитнул один из Ваших постов` 
    } else if (notification.notificationType == "like") {
        text = `${userFromName} понравился один из Ваших постов` 
    } else if (notification.notificationType == "reply") {
        text = `${userFromName} репостнул один из Ваших постов` 
    } else if (notification.notificationType == "follow") {
        text = `${userFromName} подписался на Вас` 
    }

    return `<span class='ellipsis'>${text}</span>`
}