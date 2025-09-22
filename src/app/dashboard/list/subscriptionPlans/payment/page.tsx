"use client";
import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function SubscriptionCheckoutPage() {
  const searchParams = useSearchParams();
  const amountParam = searchParams.get("amount");
  const studentId = searchParams.get("studentId");

  const amount = amountParam ? parseFloat(amountParam) : 0;

  return (
    <main className="w-full max-w-2xl mx-auto p-6 sm:p-8 md:p-10 text-black rounded-lg bg-gray-50 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">Checkout</h1>
        <h2 className="text-xl text-gray-700 mt-2">
          Total: <span className="font-bold">${amount.toFixed(2)}</span>
        </h2>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "usd",
        }}
      >
        <CheckoutPage amount={amount} studentId={studentId || ""} />
      </Elements>
    </main>
  );
}