function Languages() {
    let map = {};

    this.forEach = (callback, afterParty) => {
        if (Object.keys(map).length !== 0) {
            Object.entries(map).forEach(callback);
            afterParty();
        } else {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/api/language");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.addEventListener("load", () => {
                if (xhr.status === 200) {
                    map = JSON.parse(xhr.responseText);
                    Object.entries(map).forEach(callback);
                    afterParty();
                } else {
                    console.log(xhr.statusText)
                }
            });
            xhr.send();
        }
    }
}

const languages = new Languages();
