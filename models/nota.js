const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
titulo: {
    type: String,
    required: true
},
conteudo: {
    type: String,
    required: true
},

usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
}
}, {
timestamps: true
});
module.exports = mongoose.model('Nota', usuarioSchema);