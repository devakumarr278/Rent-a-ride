import { toast } from "sonner";
import {
  setLatestBooking,
  setisPaymentDone,
} from "../../redux/user/LatestBookingsSlice";
import { setIsSweetAlert, setPageLoading } from "../../redux/user/userSlice";

export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

//function to fetch latest bookings from db and update it to redux
const BASE_URL = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "http://localhost:3000";

export const fetchLatestBooking = async (user_id, dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/latestbookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch latest booking");
    }

    const data = await response.json();
    dispatch(setLatestBooking(data));
    dispatch(setisPaymentDone(true));
    return data;
  } catch (error) {
    console.error("Error fetching latest booking:", error);
    return null;
  }
};

//function related to razorpay payment
function fetchWithTimeout(url, options = {}, timeout = 20000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, timeout);

    fetch(url, options)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function displayRazorpay(values, navigate, dispatch) {
  try {
    console.log("2. Razorpay function started", values);
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    let refreshToken = localStorage.getItem("refreshToken");
    let accessToken = localStorage.getItem("accessToken");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return { ok: false, message: "Razorpay SDK failed to load." };
    }

    // creating a new order
    console.log("3. Order API called", values);
    let result;
    try {
      result = await fetchWithTimeout(`${BASE_URL}/api/user/razorpay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken},${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }, 20000);
    } catch (fetchError) {
      console.error("3. Order API fetch failed", fetchError);
      toast.error(fetchError.message || "Unable to reach order API.");
      return { ok: false, message: fetchError.message };
    }

    console.log("3.1 Order API result", result.status, result.ok, result.headers.get("content-type"));
    const data = await result.json();
    console.log("3.2 Order API response", data);

    if (!result.ok) {
      toast.error(data?.message || "Unable to create Razorpay order.");
      return { ok: false, message: data?.message || "Unable to create Razorpay order." };
    }

    // Getting the order details back
    const { amount, id, currency } = data;
    console.log("3.3 Razorpay order details", { amount, id, currency });

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      toast.error("Razorpay public key is not configured.");
      return { ok: false, message: "Missing Razorpay public key." };
    }

    const options = {
      key: razorpayKeyId,
      amount: amount.toString(),
      currency: currency,
      name: "Rent a Ride",
      description: "Test Transaction",
      order_id: id,
      handler: async function (response) {
        console.log("5. Payment success", response);
        const data = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        // final data to store in database
        const dbData = { ...values, ...data };
        console.log("6. Booking save started", dbData);
        const result = await fetch(`${BASE_URL}/api/user/bookCar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dbData),
        });
        const successStatus = await result.json();
        console.log("6.1 BookCar response", successStatus);
        if (successStatus) {
          dispatch(setIsSweetAlert(true));

          await fetchLatestBooking(values.user_id, dispatch);

          console.log("8. Navigating");
          navigate("/");
          dispatch(setPageLoading(false));
        }
      },
      prefill: {
        name: "Jeevan aj",
        email: "ambrahamjeevan@gmail.com",
        contact: "8086240993",
      },
      theme: {
        color: "#61dafb",
      },
    };

    console.log("4. Razorpay popup opening", window.Razorpay);
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      console.log("Payment failed", response);
      console.log("Payment failed details", response.error);
      toast.error(response.error?.description || "Payment failed. Please try again.");
      dispatch(setPageLoading(false));
    });
    paymentObject.open();
    return { ok: true };
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    return { ok: false, message: error.message };
  }
}
