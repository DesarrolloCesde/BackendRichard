const express = require('express');
const cors = require('cors');

const orderSchema = require('../models/order');

const router = express.Router();

router.use(cors());

//Agregar orden
router.post('/orders', cors(),(req, res)=>{
    const order = orderSchema(req.body);
    order
        .save()
        .then((data) => res.json(data))
        .catch((error)=> res.json({message: error}))
})

//Recuperar mesas
router.get('/orders', cors(), (req, res)=>{
    orderSchema
        .find()
        .then((data)=> res.json(data))
        .catch((error)=> res.json({message: error}))
})

// Actualizar estado de la orden
router.put('/orders/:id', cors(), (req, res) => {
    const { id } = req.params;
    const { progress } = req.body; // Cambia newStatus a progress
    orderSchema.findByIdAndUpdate(id, { progress: progress }) // Actualiza el campo progress
        .then(() => res.json({ message: 'Estado de la orden actualizado correctamente' }))
        .catch((error) => res.json({ message: error }));
});

module.exports = router;