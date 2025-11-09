//event listener
document.querySelectorAll(".authorLink").forEach((link) => {
  link.addEventListener("click", getAuthorInfo);
});

function $(selector) {
  return document.querySelector(selector);
}
async function getAuthorInfo(event) {
  event.preventDefault();
  let authorId = this.getAttribute("authorId");
  let url = `/api/authors/${authorId}`;
  let response = await fetch(url);
  let data = await response.json();
  console.log(data);

  $("#authorName").textContent =
    data[0].firstName + " " + data[0].lastName;
  $("#authorImage").src = data[0].portrait;
  $("#authorBiography").textContent = data[0].biography;
  $("#authorCountry").textContent = data[0].country;
  $("#authorDob").textContent = data[0] ? data[0].dob.split("T")[0] : "N/A";
  $("#authorDod").textContent = data[0] ? data[0].dod.split("T")[0] : "N/A";
  $("#authorProfession").textContent = data[0].profession;
  $("#authorSex").textContent = data[0].sex;

  $("#authorModal").showModal();
  $("#closeModal").addEventListener("click", () => {
    $("#authorModal").close();
  });
}
