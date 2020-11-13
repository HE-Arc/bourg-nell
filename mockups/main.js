let items = document.querySelectorAll(".history_item");
function closeAll(except)
{
    items.forEach((item) => {
        item.classList.remove("open");
    });
}
items.forEach((item) => {
    item.addEventListener("click", () => {
        closeAll();
        item.classList.add("open");
    });
});