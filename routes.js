const {addBookHandler, getAllBooks, getAllBooksById, editBookByIdHandler, deleteBookByIdHandler} = require("./handlers");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooks,
  },
  {
    method: "GET",
    path: "/books/{id}",
    handler: getAllBooksById,
  },
  {
    method: "PUT",
    path: "/books/{id}",
    handler: editBookByIdHandler,
  },
  {
    method: "DELETE",
    path: "/books/{id}",
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
