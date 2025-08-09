import mongoose from 'mongoose' 


const CartSchema = new mongoose.Schema({
    userId : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'User'
     } ,
     items : [{
        productId : {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Product'
        },
        quantity : {
            type : Number ,
            min : 1 
        }
     }],
     totalPrice : {
        type : Number ,
        default : 0
     }
})

const Cart = mongoose.model('Cart' , CartSchema)

export default Cart