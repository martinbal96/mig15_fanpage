const scoreTable = document.getElementById('scoreTable');
const scores = JSON.parse(localStorage.getItem("scores")) || [];
console.log(scores);
scoreTable.innerHTML = scores.map(score =>{
    return `<tr><td>${score.name}</td><td>${score.score}</td></tr>`
}).join("");
