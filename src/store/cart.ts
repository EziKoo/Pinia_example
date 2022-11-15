import {defineStore} from 'pinia'
import { IProduct } from '../api/shop'
import {useProductsStore} from './products'

// {id, title, price, quantity}
type CartProduct = {
  quantity: number
} & Omit<IProduct, 'inventory'>

export const useCartStore = defineStore('cart',{
  state:() => {
    return {
      cartProduts: [] as CartProduct[]  // 购物车商品列表
    }
  },
  getters:{
    totalPrice(state){
      return state.cartProduts.reduce((total,item) => {
        return total + item.price * item.quantity
      },0)
    }
  },

  actions:{
    addProductsToCart(product: IProduct){
      console.log('addProductsToCart',product);
      // 看商品有没有库存
      if(product.inventory < 1){
        return 
      }
      // 检查购物车是否已有该商品
      const cartItem = this.cartProduts.find(item => item.id === product.id)
      // 如果有则让商品的数量 + 1
      if(cartItem){
        cartItem.quantity++
      }else{
        // 如果没有，则添加到购物车列表中
        this.cartProduts.push({
          id:product.id,
          title:product.title,
          price:product.price,
          quantity:1  // 第一次加到购物车的商品的数量就是1
        })
      }
      // 更新商品的库存
      // 不建议这么做，不要相信函数的参数
      // product.inventory--
      const productsStore = useProductsStore()
      productsStore.decrementProduct(product)
    }
  }
})