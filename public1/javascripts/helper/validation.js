var timeOb = new Date();
class validation {
    existDecument(document) {
        return document.length;
    }

}
class timeinfo {
    cTime() {
        return timeOb.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    }
}
var vali = new validation;
var time = new timeinfo;
