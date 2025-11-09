document.querySelector("#searchByKeywordForm").addEventListener('submit', validateKeyword);

function validateKeyword() {
    let keyword = document.querySelector("input[name='keyword']").value;
    
    if(keyword.length < 3) {
        document.querySelector("#errorMsg").style.display = "block";
        event.preventDefault(); //prevents the submission of the form
    } else {
        document.querySelector("#errorMsg").style.display = "none";
    }
}