$(document).ready(() => {
    $.get("/api/notifications", (data) => {
        console.log(data)
    })
})