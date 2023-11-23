const {nanoid} = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
   const {title, tags, body} = request.payload;

   // Membuat ID 
   const id = nanoid(16);
   // Membuat catatan baru
   const createdAt = new Date().toISOString();
   // Mengupdate catatan
   const updatedAt = createdAt;


   const newNote = {
      title, tags, body, id, createdAt, updatedAt,
   };

   notes.push(newNote);

   //Mengecek apakah newNote sudah masuk ke dalam array notes
   const isSuccess = notes.filter((note) => note.id === id).length > 0;

   if (isSuccess) {
      const response = h.response({
         status: "SUCCEESS",
         message: "Catatan telah berhasil ditambahkan",
         data: {
            noteId : id,
         },
      });
      response.code(201);
      return response; 
   }

   const response = h.response({
      status: "FAIL",
      message: "Catatan gagal ditambahkan",
   });
   response.code(500);
   return response;
}


const getAllNotesHandler = () => ({
   status: 'SUCCESS',
   data: {
      notes,
   },
});

const getNotesByIdHandler = (request, h) => {
   const{id} = request.params;

   const note = notes.filter((n) => n.id === id)[0];

   if (note != undefined) {
      return {
         status: 'SUCCESS',
         data: {
            note,
         }
      }
   }

   const response = h.response({
      status: 'FAIL', 
      message: 'Catatan tidak ditemukan',
   });
   response.code(404);
   return response;
};

const editNoteByIdHandler = (request,h) => {
   const {id} = request.params;

   const{title, tags, body} = request.payload;
   const updatedAt = new Date().toISOString();

   const index = notes.findIndex((note) => note.id === id);

   if (index !== -1) {
      notes[index] = {
         ...notes[index],
         title,
         tags,
         body,
         updatedAt,
      };

      const response = h.response ({
         stauts: 'SUCCESS',
         message: 'Catatatn berhasil diperbarui',
      });
      response.code(200);
      return response;
   }

   const response = h.response ({
      status: 'FAIL',
      message: 'Gagal memperbarui catatan. Id tidak ditemukan',
   })
   response.code(404);
   return response;
};

const deleteNoteByIdHandler = (request, h) => {
   const {id} = request.params;

   const index = notes.findIndex((note) => note.id === id);

   if (index != -1) {
      notes.splice(index,1);
      const response = h.response ({
         status: 'SUCCESS',
         message: 'Catatan berhasil dihapus',
      });
      response.code(200);
      return response;;
   }

   const response = h.response({
      status: 'FAIL',
      message: 'Catatan gagal dihapus. Id tidak ditemukan'
   });
   response.code(404);
   return response;   
}


module.exports = {
   addNoteHandler, 
   getAllNotesHandler, 
   getNotesByIdHandler, 
   editNoteByIdHandler,
   deleteNoteByIdHandler};