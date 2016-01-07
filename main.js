window.onload = function() {
  setTimeout(function() {
    var player = new Player(document.getElementById('myVid'));
    document.getElementById('myVid2').src = "http://52.90.55.176/staticVideo";
  }, 1000);
}