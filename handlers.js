const books = require("./books");
const { nanoid } = require("nanoid");

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: readPage === pageCount ? true : false,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name && readPage <= pageCount) {
    books.push(newBook);

    const isSuccess = books.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: "fail",
      message: "Catatan gagal ditambahkan",
    });
    response.code(500);
    return response;
  } else {
    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    } else if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    } else {
      const response = h.response({
        status: "error",
        message: "Buku gagal ditambahkan",
      });
      response.code(500);
      return response;
    }
  }
};

const getAllBooks = (request, h) => {
    if (request.query.reading === "1") {
      const response = h.response({
        status: "success",
        data: {
          books: books
            .filter((item) => item.reading === true)
            .map((item) => {
              return {
                id: item.id,
                name: item.name,
                publisher: item.publisher,
              };
            }),
        },
      });
      response.code(200);
      return response;
    } else if (request.query.reading === "0") {
      const response = h.response({
        status: "success",
        data: {
          books: books
            .filter((item) => item.reading === false)
            .map((item) => {
              return {
                id: item.id,
                name: item.name,
                publisher: item.publisher,
              };
            }),
        },
      });
      response.code(200);
      return response;
    } else if (request.query.name) {
      const response = h.response({
        status: "success",
        data: {
          books: books
            .filter((item) =>
              item.name.toLowerCase().match(request.query.name.toLowerCase())
            )
            .map((item) => {
              return {
                id: item.id,
                name: item.name,
                publisher: item.publisher,
              };
            }),
        },
      });
      response.code(200);
      return response;
    } else if (request.query.finished === "1") {
      const response = h.response({
        status: "success",
        data: {
          books: books
            .filter((item) => item.finished === true)
            .map((item) => {
              return {
                id: item.id,
                name: item.name,
                publisher: item.publisher,
              };
            }),
        },
      });
      response.code(200);
      return response;
    } else if (request.query.finished === "0") {
      const response = h.response({
        status: "success",
        data: {
          books: books
            .filter((item) => item.finished === false)
            .map((item) => {
              return {
                id: item.id,
                name: item.name,
                publisher: item.publisher,
              };
            }),
        },
      });
      response.code(200);
      return response;
    } else {
      const response = h.response({
        status: "success",
        data: {
          books: books.map((item) => {
            return {
              id: item.id,
              name: item.name,
              publisher: item.publisher,
            };
          }),
        },
      });
      response.code(200);
      return response;
    }
};

const getAllBooksById = (request, h) => {
  const { id } = request.params;
  const dataBooks = books.filter((item) => item.id === id);

  const isSuccess = dataBooks.length > 0;
  if (isSuccess) {
    const response = h.response({
      status: "success",
      data: {
        book: dataBooks[0],
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((item) => item.id === id);

  if (index !== -1) {
    if (name) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: readPage === pageCount ? true : false,
        reading,
        updatedAt,
      };
      if (readPage > pageCount) {
        const response = h.response({
          status: "fail",
          message:
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
      } else {
        const response = h.response({
          status: "success",
          message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
      }
    } else {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }
  } else {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((item) => item.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooks,
  getAllBooksById,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
