import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { ArrowRightIcon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon, XIcon } from "lucide-react"

const CartSidebar = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'
    const { items, updateQuantity, removeFromCart, cartTotal, isCartOpen, setIsCartOpen } = useCart()
    const navigate = useNavigate()
    if (!isCartOpen) return null
    const deliveryFee = cartTotal > 20 ? 0 : 1.99
    const grandTotal = cartTotal + deliveryFee
    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={() => setIsCartOpen(false)}></div>
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
                <div className="flex items-center justify-between p-5 border-b border-app-border">
                    <div className="flex items-center gap-2">
                        <ShoppingBagIcon className="size-5"></ShoppingBagIcon>
                        <h2 className="test-lg font-medium">your cart</h2>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-app-cream roudned-full">{items.length} items</span>
                    </div>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-app-cream transition-colors">
                        <XIcon className="size-5"></XIcon>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {items.length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-center">
                        <ShoppingBagIcon className="size-16 text-app-border mb-4"></ShoppingBagIcon>
                        <h3 className="text-lg font-medium mb-1">your cart is empty</h3>
                    </div>) : (
                        items.map((item) => (
                            <div key={item.product.id} className="flex gap-3 bg-app-cream/60 rounded-xl p-3">
                                <img src={item.product.image} alt={item.product.name} className="size-16 rounded-lg object-cover shrink-0"></img>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold truncate">{item.product.name}</h4>
                                    <p className="text-xs text-app-text-light">{currency} {item.product.price.toFixed(2)} /{item.product.unit}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <button className="size-7 rounded-lg bg-white border border-app-border flex-center" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                                <MinusIcon className="size-3"></MinusIcon>
                                            </button>
                                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                                            <button className="size-7 rounded-lg bg-white border border-app-border flex-center" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                                <PlusIcon className="size-3"></PlusIcon>

                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold">{currency}{(item.product.price * item.quantity).toFixed(2)}</span>
                                            <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-app-text-light hover:text-app-error transition-colors">
                                                <Trash2Icon className="size-4"></Trash2Icon>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {items.length > 0 && (<div className="p-5 border-t border-app-border space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-app-text-light">subtotal</span>
                        <span className="font-medium">{currency}{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-app-text-light">delivery</span>
                        <span className="font-medium">{deliveryFee === 0 ? <span className="text-app-success">free</span> : `${currency}${deliveryFee.toFixed(2)}`}{cartTotal.toFixed(2)}</span>
                    </div>
                    {deliveryFee > 0 && <p className="text-xs text-app-text-light text-center">free delivery on orders over {currency}20</p>}
                    <div className="flex justify-between text-base font-semibold border-t border-app-border pt-3">
                        <span>total</span>
                        <span>{currency}{grandTotal.toFixed(2)}</span>
                    </div>
                    <button onClick={() => {
                        setIsCartOpen(false); navigate('/checkout'); window.scrollTo(0, 0)
                    }} className="w-full py-3 bg-app-orange text-white font-semibold rounded-xl hover:bg-app-orange-dark transition-colors flex-center gap-2 active:scale-[0.98]">proceed to checkout <ArrowRightIcon className="size-4"></ArrowRightIcon></button>
                </div>)}
            </div>
        </>
    )
}

export default CartSidebar