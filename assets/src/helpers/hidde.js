let faqs = document.querySelectorAll('.body__main-div-div-div-div-ul-li');
let frequentlyAskedQuestions = [];

const FAQS = faqs.forEach((node, index) => {
    if (index % 2 === 0) {
      frequentlyAskedQuestions.push(node);
    }
});

frequentlyAskedQuestions.forEach((el) => {
    el.addEventListener('click', function (e) {
        el.nextElementSibling.toggleAttribute("hidden");;
    });
});