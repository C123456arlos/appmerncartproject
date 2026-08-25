import { Request, Response } from "express";
import Stripe from 'stripe'
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export const stripeWebhook = async (request: Request, response: Response) => {

    let event;
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                request.body,
                signature as string,
                endpointSecret
            );
        } catch (err: any) {
            console.log(`⚠️ Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const paymentIntentId = paymentIntent.id
                const session = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntentId
                })
                const { orderId } = session.data[0].metadata as any
                const paidOrder = await prisma.order.update({
                    where: { id: orderId },
                    data: { isPaid: true }
                })
                const orderItems = (Array.isArray(paidOrder.items)) ? paidOrder.items : [] as any[]
                for (const item of orderItems) {
                    await prisma.product.update({
                        where: { id: item.product },
                        // data: {
                        //     stock: item.quantity
                        // }
                        data: { stock: { decrement: item.quantity } }
                    })
                }
                if (paidOrder) {
                    await inngest.send({ name: 'order/placed', data: { orderId } })
                }
                for (const item of orderItems) {
                    await inngest.send({ name: 'inventory/stock.updated', data: { productId: item.product } })
                }
                break;
            case 'payment_intent.canceled':
            case 'payment_intent.payment_failed': {
                const paymentIntentFailure = event.data.object as Stripe.PaymentIntent
                const paymentIntentFailureId = paymentIntentFailure.id
                const sessionFailure = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntentFailureId
                })
                const failureOrderId = (sessionFailure.data[0].metadata as any).orderId
                await prisma.order.delete({
                    where: { id: failureOrderId }
                })
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        response.json({ received: true });
    }
}








//  import { prisma } from "../config/prisma.js";
// import stripe from 'stripe'
// // import Booking from '../models/Bookings.js'
// import { inngest } from '../inngest/index.js'
// export const stripeWebhooks = async (request, response) => {
//     console.log(request)
//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
//     const sig = request.headers['stripe-signature']
//     let event
//     try {
//         event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
//     } catch (error) {
//         return response.status(400).send(`webhook error ${error.message}`)
//     }
//     try {
//         switch (event.type) {
//             case 'payment_intent.succeeded': {
//                 const paymentIntent = event.data.object
//                 const sessionList = await stripeInstance.checkout.sessions.list({
//                     payment_intent: paymentIntent.id
//                 })
//                  const paymentIntentId = paymentIntent.id
//                   const session = await stripe.checkout.sessions.list({
//                     payment_intent: paymentIntentId
//                   })
//                 console.log(stripe, 'stripe')
//                 const { orderId } = session.data[0].metadata as any
//         const paidOrder = await prisma.order.update({
//                     where: { id: orderId },
//                     data: { isPaid: true }
//                 })

//                 const orderItems = (Array.isArray(paidOrder.items)) ? paidOrder.items : [] as any[]
//           for (const item of orderItems) {
//                     await prisma.product.update({
//                         where: { id: item.product },
//                         // data: {
//                         //     stock: item.quantity
//                         // }
//                         data: { stock: { decrement: item.quantity } }
//                     })
//                 }
//  if (paidOrder) {
//                     await inngest.send({ name: 'order/placed', data: { orderId } })
//                 }

//   for (const item of orderItems) {
//                     await inngest.send({ name: 'inventory/stock.updated', data: { productId: item.product } })
//                 }
  
//                 break;
//             }
//             default:
//                 console.log('unahandled event type', event.type)
//         }
//         response.json({
//             received: true
//         })
//     } catch (err) {
//         console.log('webhook processing error', err)
//         response.status(500).send('internal server error')
//     }
// }






























// import { Request, Response } from "express";
// import Stripe from 'stripe'
// import { prisma } from "../config/prisma.js";
// import { inngest } from "../inngest/index.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// export const stripeWebhook = async (request: Request, response: Response) => {
// console.log(request, 'request')
//     let event;
//     if (endpointSecret) {
//         // Get the signature sent by Stripe
//         const signature = request.headers['stripe-signature'];
//         try {
//             event = stripe.webhooks.constructEvent(
//                 request.body,
//                 signature as string,
//                 endpointSecret
//             );
//         } catch (err: any) {
//             console.log(`⚠️ Webhook signature verification failed.`, err.message);
//             return response.sendStatus(400);
//         }

//         // Handle the event
//         switch (event.type) {
//             case 'payment_intent.succeeded':
//                 const paymentIntent = event.data.object as Stripe.PaymentIntent;
//                 const paymentIntentId = paymentIntent.id
//                 const session = await stripe.checkout.sessions.list({
//                     payment_intent: paymentIntentId
//                 })
//                 const { orderId } = session.data[0].metadata as any
//                 const paidOrder = await prisma.order.update({
//                     where: { id: orderId },
//                     data: { isPaid: true }
//                 })
//                 const orderItems = (Array.isArray(paidOrder.items)) ? paidOrder.items : [] as any[]
//                 for (const item of orderItems) {
//                     await prisma.product.update({
//                         where: { id: item.product },
//                         data: {
//                             stock: item.quantity
//                         }
//                         // data: { stock: { decrement: item.quantity } }
//                     })
//                 }
//                 if (paidOrder) {
//                     await inngest.send({ name: 'order/placed', data: { orderId } })
//                 }
//                 for (const item of orderItems) {
//                     await inngest.send({ name: 'inventory/stock.updated', data: { productId: item.product } })
//                 }
//                 break;
//             case 'payment_intent.canceled':
//             case 'payment_intent.payment_failed': {
//                 const paymentIntentFailure = event.data.object as Stripe.PaymentIntent
//                 const paymentIntentFailureId = paymentIntentFailure.id
//                 const sessionFailure = await stripe.checkout.sessions.list({
//                     payment_intent: paymentIntentFailureId
//                 })
//                 const failureOrderId = (sessionFailure.data[0].metadata as any).orderId
//                 await prisma.order.delete({
//                     where: { id: failureOrderId }
//                 })
//                 break;
//             }
//             default:
//                 console.log(`Unhandled event type ${event.type}`);
//         }

//         // Return a response to acknowledge receipt of the event
//         response.json({ received: true });
//     }
// }


















// import { Request, Response } from "express";
// import Stripe from 'stripe'
// import { prisma } from "../config/prisma.js";
// import { inngest } from "../inngest/index.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
// const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

// export const stripeWebhook = async (request: Request, response: Response) => {
// console.log(request, 'request')
//     let event;
//     if (endpointSecret) {
//         // Get the signature sent by Stripe
//         const signature = request.headers['stripe-signature'];
//         try {
//             event = stripe.webhooks.constructEvent(
//                 request.body,
//                 signature as string,
//                 endpointSecret
//             );
//         } catch (err: any) {
//             console.log(`⚠️ Webhook signature verification failed.`, err.message);
//             return response.sendStatus(400);
//         }

//         // Handle the event
//         switch (event.type) {
//             case 'payment_intent.succeeded':
//                 const paymentIntent = event.data.object as Stripe.PaymentIntent;
//                 const paymentIntentId = paymentIntent.id
//                 const session = await stripe.checkout.sessions.list({
//                     payment_intent: paymentIntentId
//                 })
//                 const { orderId } = session.data[0].metadata as any
//                 const paidOrder = await prisma.order.update({
//                     where: { id: orderId },
//                     data: { isPaid: true }
//                 })
//                 const orderItems = (Array.isArray(paidOrder.items)) ? paidOrder.items : [] as any[]
//                 for (const item of orderItems) {
//                     await prisma.product.update({
//                         where: { id: item.product },
//                         // data: {
//                         //     stock: item.quantity
//                         // }
//                         data: { stock: { decrement: item.quantity } }
//                     })
//                 }
//                 if (paidOrder) {
//                     await inngest.send({ name: 'order/placed', data: { orderId } })
//                 }
//                 for (const item of orderItems) {
//                     await inngest.send({ name: 'inventory/stock.updated', data: { productId: item.product } })
//                 }
//                 break;
//             case 'payment_intent.canceled':
//             case 'payment_intent.payment_failed': {
//                 const paymentIntentFailure = event.data.object as Stripe.PaymentIntent
//                 const paymentIntentFailureId = paymentIntentFailure.id
//                 const sessionFailure = await stripe.checkout.sessions.list({
//                     payment_intent: paymentIntentFailureId
//                 })
//                 const failureOrderId = (sessionFailure.data[0].metadata as any).orderId
//                 await prisma.order.delete({
//                     where: { id: failureOrderId }
//                 })
//                 break;
//             }
//             default:
//                 console.log(`Unhandled event type ${event.type}`);
//         }

//         // Return a response to acknowledge receipt of the event
//         response.json({ received: true });
//     }
// }









// import { prisma } from "../config/prisma.js"
// import stripe from 'stripe'
// export const stripeWebhook = async (request:Request, response:Response) => {
//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY as string)
//     const sig = request.headers['stripe-signature']
//     let event
//     try {
//         event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
//     } catch (err) {
//         response.status(400).send('`webhook error ${err.message}')
//     }
//     if (event.type === 'payment_intent.succeeded') {
//         const paymentIntent = event.data.object
//         const paymentIntentId = paymentIntent.id
//         const session = await stripeInstance.checkout.sessions.list({
//             payment_intent: paymentIntentId
//         })
// const { orderId } = session.data[0].metadata as any
//      await prisma.order.update({
//                     where: { id: orderId },
//                     data: { isPaid: true }
//                 })



//     } else {
//         console.log('unhandled event type', event.type)
//     }
//     response.json({ received: true })
// }