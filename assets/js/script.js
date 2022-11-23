function displayLinks() {
  var x = document.getElementById("selections");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}
for (let i = 0; i < 22; i++) {
  id = `#park-selection-btn` + i;
  // console.log(id);
  $(id).on(`click`, function () {
    console.log(this.val);
  });
}

function selectedPark() {
  console.log($(`#park-selection-btn0`).val());
}

$(`#1`).on(`click`, function () {
  console.log($(`#1`).val());
});
