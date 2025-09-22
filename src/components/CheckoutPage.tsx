"use client";
import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
interface Parent {
  _id: string;
  username: string;
  email: string;
  whatsapp: string;
  address: {
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string,
  },
  motherFirstName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherLastName: string;
}
interface Student {
  _id: string;
  selectedPlan: string;
  billingCycle: string;
  sessionType: string;
  sessionLimit: number;
  sessionUsed: number;
  planStartDate: string;
  planEndDate: string;
  planName: string;
  paymentStatus: string;
}
function getCountryCode(countryName: string): string {
  const map: Record<string, string> = {
    "Afghanistan": "AF",
    "Albania": "AL",
    "Algeria": "DZ",
    "Andorra": "AD",
    "Angola": "AO",
    "Argentina": "AR",
    "Armenia": "AM",
    "Australia": "AU",
    "Austria": "AT",
    "Azerbaijan": "AZ",
    "Bahamas": "BS",
    "Bahrain": "BH",
    "Bangladesh": "BD",
    "Barbados": "BB",
    "Belarus": "BY",
    "Belgium": "BE",
    "Belize": "BZ",
    "Benin": "BJ",
    "Bhutan": "BT",
    "Bolivia": "BO",
    "Bosnia and Herzegovina": "BA",
    "Botswana": "BW",
    "Brazil": "BR",
    "Brunei": "BN",
    "Bulgaria": "BG",
    "Burkina Faso": "BF",
    "Burundi": "BI",
    "Cambodia": "KH",
    "Cameroon": "CM",
    "Canada": "CA",
    "Cape Verde": "CV",
    "Central African Republic": "CF",
    "Chad": "TD",
    "Chile": "CL",
    "China": "CN",
    "Colombia": "CO",
    "Comoros": "KM",
    "Congo (Brazzaville)": "CG",
    "Congo": "CD",
    "Costa Rica": "CR",
    "Croatia": "HR",
    "Cuba": "CU",
    "Cyprus": "CY",
    "Czech Republic": "CZ",
    "Denmark": "DK",
    "Djibouti": "DJ",
    "Dominica": "DM",
    "Dominican Republic": "DO",
    "East Timor (Timor Timur)": "TL",
    "Ecuador": "EC",
    "Egypt": "EG",
    "El Salvador": "SV",
    "Equatorial Guinea": "GQ",
    "Eritrea": "ER",
    "Estonia": "EE",
    "Ethiopia": "ET",
    "Fiji": "FJ",
    "Finland": "FI",
    "France": "FR",
    "Gabon": "GA",
    "Gambia": "GM",
    "Georgia": "GE",
    "Germany": "DE",
    "Ghana": "GH",
    "Greece": "GR",
    "Grenada": "GD",
    "Guatemala": "GT",
    "Guinea": "GN",
    "Guinea-Bissau": "GW",
    "Guyana": "GY",
    "Haiti": "HT",
    "Honduras": "HN",
    "Hungary": "HU",
    "Iceland": "IS",
    "India": "IN",
    "Indonesia": "ID",
    "Iran": "IR",
    "Iraq": "IQ",
    "Ireland": "IE",
    "Israel": "IL",
    "Italy": "IT",
    "Ivory Coast": "CI",
    "Jamaica": "JM",
    "Japan": "JP",
    "Jordan": "JO",
    "Kazakhstan": "KZ",
    "Kenya": "KE",
    "Kiribati": "KI",
    "Korea (North)": "KP",
    "Korea (South)": "KR",
    "Kuwait": "KW",
    "Kyrgyzstan": "KG",
    "Laos": "LA",
    "Latvia": "LV",
    "Lebanon": "LB",
    "Lesotho": "LS",
    "Liberia": "LR",
    "Libya": "LY",
    "Liechtenstein": "LI",
    "Lithuania": "LT",
    "Luxembourg": "LU",
    "Macedonia": "MK",
    "Madagascar": "MG",
    "Malawi": "MW",
    "Malaysia": "MY",
    "Maldives": "MV",
    "Mali": "ML",
    "Malta": "MT",
    "Marshall Islands": "MH",
    "Mauritania": "MR",
    "Mauritius": "MU",
    "Mexico": "MX",
    "Micronesia": "FM",
    "Moldova": "MD",
    "Monaco": "MC",
    "Mongolia": "MN",
    "Montenegro": "ME",
    "Morocco": "MA",
    "Mozambique": "MZ",
    "Myanmar": "MM",
    "Namibia": "NA",
    "Nauru": "NR",
    "Nepal": "NP",
    "Netherlands": "NL",
    "New Zealand": "NZ",
    "Nicaragua": "NI",
    "Niger": "NE",
    "Nigeria": "NG",
    "Norway": "NO",
    "Oman": "OM",
    "Pakistan": "PK",
    "Palau": "PW",
    "Panama": "PA",
    "Papua New Guinea": "PG",
    "Paraguay": "PY",
    "Peru": "PE",
    "Philippines": "PH",
    "Poland": "PL",
    "Portugal": "PT",
    "Qatar": "QA",
    "Romania": "RO",
    "Russia": "RU",
    "Rwanda": "RW",
    "Saint Kitts and Nevis": "KN",
    "Saint Lucia": "LC",
    "Saint Vincent": "VC",
    "Samoa": "WS",
    "San Marino": "SM",
    "Sao Tome and Principe": "ST",
    "Saudi Arabia": "SA",
    "Senegal": "SN",
    "Serbia": "RS",
    "Seychelles": "SC",
    "Sierra Leone": "SL",
    "Singapore": "SG",
    "Slovakia": "SK",
    "Slovenia": "SI",
    "Solomon Islands": "SB",
    "Somalia": "SO",
    "South Africa": "ZA",
    "Spain": "ES",
    "Sri Lanka": "LK",
    "Sudan": "SD",
    "Suriname": "SR",
    "Swaziland": "SZ",
    "Sweden": "SE",
    "Switzerland": "CH",
    "Syria": "SY",
    "Taiwan": "TW",
    "Tajikistan": "TJ",
    "Tanzania": "TZ",
    "Thailand": "TH",
    "Togo": "TG",
    "Tonga": "TO",
    "Trinidad and Tobago": "TT",
    "Tunisia": "TN",
    "Turkey": "TR",
    "Turkmenistan": "TM",
    "Tuvalu": "TV",
    "Uganda": "UG",
    "Ukraine": "UA",
    "United Arab Emirates": "AE",
    "United Kingdom": "GB",
    "United States": "US",
    "Uruguay": "UY",
    "Uzbekistan": "UZ",
    "Vanuatu": "VU",
    "Vatican City": "VA",
    "Venezuela": "VE",
    "Vietnam": "VN",
    "Yemen": "YE",
    "Zambia": "ZM",
    "Zimbabwe": "ZW"
  };
  return map[countryName] || "US"; 
}
const CheckoutPage = ({ amount, studentId }: { amount: number; studentId: string; }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState("debit");
  const [parent, setParent] = useState<Parent | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const parentId = session?.user?.id || "";

 useEffect(() => {
    const fetchParent = async () => {
      if (!parentId) return;
      try {
        const res = await fetch(`/api/parents/${parentId}`);
        const data = await res.json();
        setParent(data);
      } catch (err) {
        console.error("Failed to fetch parent details:", err);
      }
    };

    const fetchStudent = async () => {
      if (!studentId) return;
      try {
        const res = await fetch(`/api/student/${studentId}`);
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Failed to fetch student details:", err);
      }
    };

    fetchParent();
    fetchStudent();
  }, [parentId, studentId]);

  // Create Stripe intent
  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!stripe || !elements || !parent || !student) {
      setErrorMessage("Missing required information");
      setLoading(false);
      return;
    }
    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      setErrorMessage("Card element not found");
      setLoading(false);
      return;
    }
    // Create PaymentMethod
    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
      billing_details: {
        name: `${parent.fatherFirstName} ${parent.fatherLastName} & ${parent.motherFirstName} ${parent.motherLastName}`,
        email: parent.email,
        phone: parent.whatsapp,
        address: {
          line1: parent.address.street,
          city: parent.address.city,
          state: parent.address.state,
          postal_code: parent.address.postalCode,
          country: getCountryCode(parent.address.country),
        },
      },
    });
    if (pmError) {
      setErrorMessage(pmError.message);
      setLoading(false);
      return;
    }
    // Confirm Payment
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: paymentMethod.id }
    );
    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      try {
        const res = await fetch("/api/savePayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            parentId: parent._id,
            amount,
            currency: paymentIntent.currency,
            transactionId: paymentIntent.id,
            paymentMethod: paymentMethod.card?.brand || "card",
            paidAt: new Date(),
            planStartDate: student.planStartDate,
            planEndDate: student.planEndDate,
            billingCycle: student.billingCycle,
            sessionType: student.sessionType,
            sessionLimit: student.sessionLimit,
            planName: student.planName,
            billingDetails: {
              name: `${parent.fatherFirstName} ${parent.fatherLastName} & ${parent.motherFirstName} ${parent.motherLastName}`,
              email: parent.email,
              phone: parent.whatsapp,
              address: {
                line1: parent.address.street,
                city: parent.address.city,
                state: parent.address.state,
                postal_code: parent.address.postalCode,
                country: getCountryCode(parent.address.country),
              },
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save payment");
        router.push(
          `/paymentSuccess?studentId=${studentId}&amount=${amount}&transactionId=${paymentIntent.id}`
        );
      } catch (err) {
        console.error("Failed to save payment:", err);
        setErrorMessage(
          "Payment succeeded but failed to save details. Please contact support."
        );
      }
    }
    setLoading(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px", color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };
  
  if (!clientSecret) {
    return <p className="text-center">Loading checkout...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">

      {/* Card Type Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Choose Payment Method
        </h3>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="cardType"
              value="debit"
              checked={cardType === "debit"}
              onChange={() => setCardType("debit")}
              className="accent-blue-600"
            />
            Debit Card
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="cardType"
              value="credit"
              checked={cardType === "credit"}
              onChange={() => setCardType("credit")}
              className="accent-blue-600"
            />
            Credit Card
          </label>
        </div>
      </div>

      {/* Card Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {cardType === "debit"
            ? "Enter Debit Card Details"
            : "Enter Credit Card Details"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-lg text-gray-700 mb-1">
              Card Number
            </label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardNumberElement options={cardElementOptions} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg text-gray-700 mb-1">
                Expiration Date
              </label>
              <div className="border border-gray-300 rounded-md p-3">
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </div>

            <div>
              <label className="block text-lg text-gray-700 mb-1">
                CVC
              </label>
              <div className="border border-gray-300 rounded-md p-3">
                <CardCvcElement options={cardElementOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        disabled={!stripe || loading}
        className="text-white w-full p-4 bg-blue-600 rounded-md font-bold disabled:opacity-50 hover:bg-blue-700 transition"
      >
        {!loading ? `Pay $${amount.toFixed(2)}` : "Processing..."}
      </button>
    </form>
  );
};

export default CheckoutPage;