let link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
document.head.appendChild(link.cloneNode(true));
link.href = "./style.css";
document.head.appendChild(link.cloneNode(true));

fetch("https://rahadkumar.github.io/EmojiPicker/allEmojis.json")
.then(res => res.json())
.then(data => {
    AllEmojis(data)
})
.catch(err => {
    console.log(err);
})

let emojisName = ["recent"];
let emoji_symbol_name = [ "schedule", "mood", "group", "thumb_up", "checkroom", "cruelty_free", "lunch_dining", "stadia_controller", "flight_takeoff", "emoji_objects", "interests", "flag" ];

function AllEmojis(data) {
    for(let i in data) {
        emojisName.push(i);
    }
    creatingEmojiHead(data);
}

const emoji_wrapper = document.createElement("div");
let clickOntitle = false;
let recentEmojis = [];

function creatingEmojiHead(data) {

    let expendEmoji = document.createElement("span");
    expendEmoji.classList.add("material-symbols-outlined", "expendEmoji");
    expendEmoji.textContent = "sentiment_satisfied_alt";

    expendEmoji.addEventListener("click", expendAllEmojis);

    const emoji_head = document.createElement("div");
    emoji_head.classList.add("emoji_head");
    emoji_wrapper.classList.add("emoji_wrapper");

    emoji_symbol_name.forEach((symbol, index) => {
        let emoji_title = document.createElement("a");
        let emoji_symbol = document.createElement("span");
        let emoji_catagory = document.createElement("h4");

        emoji_symbol.classList.add("material-symbols-outlined");
        emoji_title.classList.add("emoji_title");
        emoji_symbol.textContent = symbol;
        emoji_catagory.textContent = emojisName[index];
        emoji_title.setAttribute("href", "#" + emojisName[index]);

        if(index == 1) {
            emoji_title.classList.add("active");
        }

        emoji_title.append(emoji_symbol, emoji_catagory);
        emoji_head.append(emoji_title);

        emoji_title.addEventListener("click", () => {
            clickOntitle = true
            document.querySelector(".allEmojis").onscrollend = () => {
                clickOntitle = false
            }
        });
    })
    
    emoji_wrapper.append(emoji_head);

    const allEmojis = document.createElement("div");
    allEmojis.classList.add("allEmojis");
    
    emojisName.forEach(name => {
        const emoji_row = document.createElement("div");
        emoji_row.classList.add("emoji_row");
        emoji_row.setAttribute("id", name);
        if (name == "recent") {

            let storedRecent = localStorage.getItem(btoa("recent"));
            storedRecent && (() => {
                for(let i of storedRecent) {
                    if (i != ',') {
                        recentEmojis.push(i);
                        e(i, "recent");
                    }
                }
            })();
        }
        else if (data[name]) {
            data[name].forEach(em => {
                e(em);
            })
        }
        function e(c, r) {
            let span = document.createElement("span");
            span.textContent = c;
            emoji_row.append(span);

            allEmojis.append(emoji_row);

            span.addEventListener("click", (e) => clickedONEmoji(e.target, expendEmoji, r));
        }
    })

    emoji_wrapper.append(allEmojis);
    document.body.append(emoji_wrapper);

    allEmojis.addEventListener("scroll", (e) => allEmojisScrolling(e, emoji_head));


    document.querySelector(".input").append(expendEmoji)
}

function expendAllEmojis() {
    emoji_wrapper.style.transform.includes("scale(1)") ? (() => {
        emoji_wrapper.style.transform = "scale(0)";
    })() : (() => {
        emoji_wrapper.style.transform = "scale(1)";
    })();
    
    const placeEmojiWrapper = () => {
        emoji_wrapper.style.left = Math.abs(parseInt(getComputedStyle(emoji_wrapper).width) - this.getBoundingClientRect().left - 50) + "px";
        emoji_wrapper.style.top = (this.getBoundingClientRect().top + 60) + "px";
    }

    placeEmojiWrapper();
    addEventListener("resize", placeEmojiWrapper)
}

function clickedONEmoji(it, expendEmoji, r) {
    let inpMessage = expendEmoji.parentElement.querySelector(`input[type="text"], textarea, .textarea, #textarea`);

    inpMessage.value += it.innerHTML;
    inpMessage.focus();

    if (!r) {
        if (recentEmojis.length == 0) {
            localStorage.setItem(btoa("recent"), it.innerHTML);
        }
        else if (!recentEmojis.includes(it.innerHTML)) {
            recentEmojis.push(it.innerHTML);
            localStorage.setItem(btoa("recent"), recentEmojis);
        }
    }
}

function allEmojisScrolling(ev, emoji_head) {
    ev.target.querySelectorAll(".emoji_row").forEach(row => {
        if (row.offsetTop <= ev.target.scrollTop + 150) {
            emoji_head.querySelector(".emoji_title.active").classList.remove("active");
            const active = emoji_head.querySelector(`.emoji_title[href="#${row.id}"]`);
            active.classList.add("active");

            if(!clickOntitle) {
                emoji_head.scrollTop = active.offsetTop - 50
            }
        }
    })
}