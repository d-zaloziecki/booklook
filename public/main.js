let searchId = 1
let searchedBook = [];

let source = $('#book-template').html();
const bookTemplate = Handlebars.compile(source);
source = $('#error-template').html();
const erroTemplate = Handlebars.compile(source);

const renderBook = function () {

    $('.books').empty();

    const newHTML = bookTemplate({ books: searchedBook });

    $('.books').append(newHTML);
}

const renderError = function (text) {
    $('.books').empty();

    const newHTML = erroTemplate({ error: text });

    $('.books').append(newHTML);
}

const renderLoad = function () {
    $('.books').empty();

    const source = $('#loading-template').html();
    const template = Handlebars.compile(source);
    const newHTML = template();

    $('.books').append(newHTML);
}

const serchBook = function (input, searchType) {
    renderLoad();
    $.get({
        url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchType + ':' + input,
        success: function (data) {
            if (validateResult(data, searchType)) {
                searchedBook=[];

                for (let i = 0; i < data.items.length && i < 10; i++) {
                    data.items[i].searchId = searchId;
                    searchedBook.push(data.items[i])
                    searchId++;
                }
                renderBook();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus);

        }
    })

}

const validateResult = function (data, searchType) {
    if (searchType === 'none') {
        renderError("You didn't choose a search type!!!")
        return false;
    }

    else if (searchType === 'isbn') {
        if (data.totalItems === 0) {
            renderError("We couldn't find a book with this ISBN, check if it is correct")
            return false;
        }
        return true;
    }

    else if (searchType === 'intitle') {
        if (data.totalItems === 0) {
            renderError("We couldn't find a book with this title, try again.")
            return false;
        }
        return true;
    }

    else if (searchType === "inauthor") {
        if (data.totalItems === 0) {
            renderError("We couldn't find a books with this author, try again.")
            return false;
        }
        return true;
    }
}

const showSpesificBook = function (bookId) {
    searchedBook = searchedBook.filter((item) => { return bookId == item.searchId })
    renderBook()
}

$('.search').on("click", function () {
    let input = $('.searchInput').val();
    let searchType = $('.searchType').val();
    serchBook(input, searchType);
})

$('.books').on("click", ".title", function () {
    let bookId = $(this).closest('.book').data().id;
    showSpesificBook(bookId);
})