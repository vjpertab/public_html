let widget_container = document.getElementById("widget-container");
let score_element = document.getElementById("score");
let stores = document.getElementsByClassName("store");

let score = 5;
let super_gompei_count = 0;

function changeScore(amount) {
    score += amount;
    score_element.innerText = "Score: " + score;
    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost"));
        if (cost > score) {
            store.setAttribute("broke", "");
        }
        else {
            store.removeAttribute("broke");
        }
    }
}

function buy(store) {
    let cost = parseInt(store.getAttribute("cost"));
    if (cost > score) {
        return;
    }
    changeScore(-cost);

    let super_gompei = document.querySelector("#widget-container #super-gompei")?.parentElement;
    if (store.getAttribute("name") == "Super-Gompei" && super_gompei != null) {
        let old_reap = parseInt(super_gompei.getAttribute("reap"));
        super_gompei.setAttribute("reap", old_reap + 100);
        super_gompei_count++;
        document.body.style = "--gompei-count: " + super_gompei_count;
        return;
    }

    let new_widget = store.firstElementChild.cloneNode(true);

    new_widget.onclick = () => {
        harvest(new_widget);
    }
    widget_container.appendChild(new_widget);

    if (new_widget.getAttribute("auto") == "true") {
        new_widget.setAttribute("harvesting", "");
        setup_end_harvest(new_widget);
    }
}

function setup_end_harvest(widget) {
    setTimeout(() => {
        widget.removeAttribute("harvesting");
        if (widget.getAttribute("auto") == "true") {
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000);
}

function harvest(widget) {
    if (widget.hasAttribute("harvesting")) {
        return;
    }
    widget.setAttribute("harvesting", "");

    changeScore(parseInt(widget.getAttribute("reap")));

    givePoints(widget);

    setup_end_harvest(widget);
}

function givePoints(widget) {
    let points_element = document.createElement("span");
    points_element.className = "point";
    points_element.innerHTML = "+" + widget.getAttribute("reap");
    points_element.onanimationend = () => {
        points_element.remove();
    }
    widget.appendChild(points_element);
}